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
  const groupId = input.groupId?.trim();
  if (groupId && (groupId.includes("/") || groupId === "." || groupId === "..")) {
    throw new Error("Select a valid savings group.");
  }
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
    ...(groupId ? { groupId } : {}),
  };
  return {
    id: ref.id,
    async submit() {
      ensureSameUser(uid);
      if (groupId) {
        const group = await getDoc(doc(db, "groups", groupId));
        ensureSameUser(uid);
        const members = group.exists() ? group.data() : null;
        if (!members || (members.creatorId !== uid && !members.members?.includes(uid))) {
          throw new Error("You must belong to the selected savings group to request a loan.");
        }
      }
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

// Preserve the shared branch's API while using the authenticated, retry-safe flow.
export async function getLoansByUser(userId: string): Promise<Loan[]> {
  if (userId !== currentUid()) throw new Error("You can only load your own loan applications.");
  return getMyLoans();
}

export async function getLoansByGroup(groupId: string): Promise<Loan[]> {
  const uid = currentUid();
  if (!groupId || groupId.includes("/")) throw new Error("A valid savings group is required.");
  const group = await getDoc(doc(db, "groups", groupId));
  ensureSameUser(uid);
  if (!group.exists() || (group.data().creatorId !== uid && !group.data().members?.includes(uid))) {
    throw new Error("You must belong to this savings group to view its loans.");
  }
  // Firestore rules still determine which group records the caller may read.
  const snapshot = await getDocs(query(collection(db, "loans"), where("groupId", "==", groupId), where("userId", "==", uid)));
  ensureSameUser(uid);
  return snapshot.docs.map(record => loanFromDocument(record.id, record.data()))
    .filter(loan => loan.groupId === groupId && loan.userId === uid)
    .sort((a, b) => (b.applicationDate?.getTime() ?? 0) - (a.applicationDate?.getTime() ?? 0));
}

export async function submitLoanRequest(input: { userId: string; groupId: string; amount: number | string; reason: string; repaymentMonths?: number }): Promise<Loan | null> {
  if (input.userId !== currentUid()) throw new Error("Please sign in before requesting a loan.");
  if (!input.groupId?.trim()) throw new Error("A savings group is required.");
  const submission = prepareLoanApplication({
    amount: String(input.amount), purpose: input.reason,
    repaymentMonths: String(input.repaymentMonths ?? 12), groupId: input.groupId,
  });
  return getMyLoan(await submission.submit());
}

export async function getLoanRequests() {
  return (await getMyLoans()).map(loan => ({ ...loan, termMonths: loan.repaymentMonths, status: loan.status.toLowerCase() }));
}
