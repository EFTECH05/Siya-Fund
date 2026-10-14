import {
  createLoanModel,
  validateLoanApplication,
} from '../models/Loan';

import {
  submitLoanRequest,
  getLoansByUser,
  getLoansByGroup,
} from '../services/LoanService';

export async function requestLoan({
  userId,
  groupId,
  amount,
  reason,
}) {
  const errors = validateLoanApplication({
    amount,
    reason,
    groupId,
  });

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  if (!userId) {
    return {
      success: false,
      errors: {
        userId: 'Please sign in before requesting a loan.',
      },
    };
  }

  try {
    const loan = createLoanModel({
      userId,
      groupId,
      amount,
      reason,
    });

    const savedLoan = await submitLoanRequest(loan);

    return {
      success: true,
      loan: savedLoan,
    };
  } catch (error) {
    console.error('Loan request failed:', error);

    return {
      success: false,
      errors: {
        general: 'Unable to submit your loan request. Please try again.',
      },
    };
  }
}

export async function fetchUserLoans(userId) {
  return getLoansByUser(userId);
}

export async function fetchGroupLoans(groupId) {
  return getLoansByGroup(groupId);
}
