export const LOAN_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PAID: 'Paid',
};

export function createLoanModel({
  userId,
  groupId,
  amount,
  reason,
}) {
  return {
    userId,
    groupId,
    amount: Number(amount),
    reason: reason.trim(),
    status: LOAN_STATUS.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function validateLoanApplication({
  amount,
  reason,
  groupId,
}) {
  const errors = {};

  const parsedAmount = Number(amount);

  if (
    amount === '' ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0
  ) {
    errors.amount = 'Enter a valid loan amount greater than zero.';
  }

  if (reason.trim().length < 10) {
    errors.reason =
      'Please explain your reason in at least 10 characters.';
  }

  if (!groupId || !groupId.trim()) {
    errors.groupId = 'A savings group is required.';
  }

  return errors;
}
