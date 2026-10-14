import { getMyLoan, getMyLoans, prepareLoanApplication, submitLoanRequest, getLoansByUser, getLoansByGroup } from "../services/LoanService";

export const loadLoanApplications = getMyLoans;
export const loadLoanDetails = getMyLoan;
export const prepareLoanRequest = prepareLoanApplication;

export const fetchUserLoans = getLoansByUser;
export const fetchGroupLoans = getLoansByGroup;

export async function requestLoan(input: { userId: string; groupId: string; amount: string; reason: string }) {
  const errors: Record<string, string> = {};
  if (!input.userId) errors.userId = "Please sign in before requesting a loan.";
  if (!input.groupId?.trim()) errors.groupId = "A savings group is required.";
  if (input.reason.trim().length < 10) errors.reason = "Please explain your reason in at least 10 characters.";
  if (Object.keys(errors).length) return { success: false, errors, loan: null };
  try {
    const loan = await submitLoanRequest(input);
    return { success: true, errors, loan };
  } catch (error) {
    errors.general = error instanceof Error ? error.message : "Unable to submit your loan request. Please try again.";
    return { success: false, errors, loan: null };
  }
}
