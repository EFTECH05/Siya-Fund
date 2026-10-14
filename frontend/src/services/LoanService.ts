import { collection, doc, getDoc, getDocs, query, where, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Loan, LoanApplicationInput, loanFromDocument, validateLoanApplication } from "../models/Loan";

function currentUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Please log in to view your loans.");
  return uid;
}

function ensureSameUser(uid: string): void {
  if (auth.currentUser?.uid !== uid) throw new Error("Your session changed. Please log in again.");
}

export async function getMyLoans(): Promise<Loan[]> {
  const uid = currentUid();
  // Filter on the server. Do not download other members' loans.
  const snapshot = await getDocs(query(collection(db, "loans"), where("userId", "==", uid)));
  ensureSameUser(uid);
  return snapshot.docs
    .map(record => loanFromDocument(record.id, record.data()))
    .filter(loan => loan.userId === uid)
    .sort((a, b) => (b.applicationDate?.getTime() ?? 0) - (a.applicationDate?.getTime() ?? 0) || a.id.localeCompare(b.id));
}

export async function getMyLoan(id: string): Promise<Loan | null> {
  const uid = currentUid();
  if (!id || id.includes("/") || id === "." || id === "..") return null;
  try {
    const snapshot = await getDoc(doc(db, "loans", id));
    ensureSameUser(uid);
    if (!snapshot.exists()) return null;
    const loan = loanFromDocument(snapshot.id, snapshot.data());
    return loan.userId === uid ? loan : null;
  } catch (error) {
    if ((error as { code?: string }).code === "permission-denied") return null;
    throw error;
  }
}

// Keeping one reference across retries avoids creating duplicate applications
// when the first save succeeds but its acknowledgement is interrupted.
export interface LoanSubmission {
  id: string;
  submit: () => Promise<string>;
}

export function prepareLoanApplication(input: LoanApplicationInput): LoanSubmission {
  const uid = currentUid();
  const fields = validateLoanApplication(input);
  const ref = doc(collection(db, "loans"));
  const data = {
    userId: uid,
    amount: fields.amount,
    currency: "ZAR",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "pending",
    purpose: fields.purpose,
    termMonths: fields.repaymentMonths,
  };
  return {
    id: ref.id,
    async submit() {
      ensureSameUser(uid);
      // A confirmed existing own application means an earlier retry succeeded.
      const existing = await getMyLoan(ref.id);
      if (existing) return ref.id;
      ensureSameUser(uid);
      await setDoc(ref, data);
      ensureSameUser(uid);
      return ref.id;
    },
  };
}
