import { getMyLoan, getMyLoans, prepareLoanApplication } from "../services/LoanService";

export const loadLoanApplications = getMyLoans;
export const loadLoanDetails = getMyLoan;
export const prepareLoanRequest = prepareLoanApplication;
