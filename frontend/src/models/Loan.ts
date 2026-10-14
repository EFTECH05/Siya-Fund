export interface Loan {
  id: string;
  userId: string;
  amount: number | null;
  currency: string;
  applicationDate: Date | null;
  status: string;
  groupId: string;
  groupName: string;
  purpose: string;
  repaymentMonths: number | null;
  interestRate: number | null;
  decisionDate: Date | null;
}

export interface LoanApplicationInput {
  amount: string;
  purpose: string;
  repaymentMonths: string;
}

export function validateLoanApplication(input: LoanApplicationInput) {
  const amountText = input.amount.trim();
  const amount = Number(amountText);
  if (!/^\d+(\.\d{1,2})?$/.test(amountText) || !Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(Math.round(amount * 100))) {
    throw new Error("Enter an amount greater than zero, with no more than two decimal places.");
  }
  const purpose = input.purpose.trim();
  if (!purpose || purpose.length > 500) throw new Error("Enter a loan purpose of 1 to 500 characters.");
  const term = input.repaymentMonths.trim();
  const repaymentMonths = Number(term);
  if (!/^\d+$/.test(term) || !Number.isSafeInteger(repaymentMonths) || repaymentMonths < 1 || repaymentMonths > 120) {
    throw new Error("Enter a repayment term as a whole number between 1 and 120 months.");
  }
  return { amount, purpose, repaymentMonths };
}

export function parseLoanDate(value: unknown): Date | null {
  try {
    let date: Date;
    if (value instanceof Date) date = value;
    else if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") date = value.toDate();
    else if (typeof value === "string" && value.trim()) date = new Date(value);
    else return null;
    return date instanceof Date && Number.isFinite(date.getTime()) ? date : null;
  } catch { return null; }
}

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const number = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

export function loanFromDocument(id: string, data: Record<string, unknown>): Loan {
  return {
    id,
    userId: text(data.userId),
    amount: number(data.amount),
    currency: text(data.currency) || "ZAR",
    applicationDate: parseLoanDate(data.createdAt) ?? parseLoanDate(data.applicationDate),
    status: text(data.status) || "unknown",
    groupId: text(data.groupId),
    groupName: text(data.groupName),
    purpose: text(data.purpose),
    repaymentMonths: number(data.termMonths) ?? number(data.repaymentMonths),
    interestRate: number(data.interestRate),
    decisionDate: parseLoanDate(data.decisionDate),
  };
}

export function formatLoanAmount(loan: Pick<Loan, "amount" | "currency">): string {
  if (loan.amount === null) return "Amount unavailable";
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency: loan.currency }).format(loan.amount);
  } catch { return `${loan.currency} ${loan.amount.toFixed(2)}`; }
}

export function formatLoanDate(date: Date | null): string {
  if (!date) return "Date unavailable";
  return new Intl.DateTimeFormat("en-ZA", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Johannesburg" }).format(date);
}

export function loanStatusLabel(status: string): string {
  return status.replace(/[_-]+/g, " ").replace(/\b\w/g, value => value.toUpperCase());
}

export function loanStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "approved": case "paid": case "disbursed": return "#15803D";
    case "rejected": case "declined": return "#B91C1C";
    case "pending": case "under_review": return "#92400E";
    default: return "#52635A";
  }
}
