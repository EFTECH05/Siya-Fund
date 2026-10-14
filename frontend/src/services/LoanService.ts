
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db, auth } from './firebase';

const LOANS_COLLECTION = 'loans';

export async function submitLoanRequest(loan) {
  const loanData = {
    userId: loan.userId,
    groupId: loan.groupId,
    amount: Number(loan.amount),
    reason: loan.reason.trim(),
    status: 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, LOANS_COLLECTION),
    loanData
  );

  return {
    id: docRef.id,
    ...loanData,
  };
}

export async function getLoansByUser(userId) {
  if (!userId) {
    throw new Error('A valid user ID is required.');
  }

  const loansQuery = query(
    collection(db, LOANS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(loansQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getLoansByGroup(groupId) {
  if (!groupId) {
    throw new Error('A valid group ID is required.');
  }

  const loansQuery = query(
    collection(db, LOANS_COLLECTION),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(loansQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}


export async function getLoanRequests() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Please log in to view your loan requests.');
  }

  const loans = await getLoansByUser(user.uid);

  return loans.map((loan) => ({
    ...loan,
    purpose: loan.purpose ?? loan.reason ?? 'Loan request',
    termMonths: Number(loan.termMonths ?? 1),
    status: String(loan.status ?? 'pending').toLowerCase(),
  }));
}
