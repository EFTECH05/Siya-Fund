
import { auth } from "./firebase";

// ==========================================
// BACKEND CONFIGURATION
// ==========================================

const API_URL =
  "https://viscosity-resident-strategy.ngrok-free.dev";

// ==========================================
// TYPES
// ==========================================

export type LoanDecision = "approve" | "reject";

export interface LoanAdminRecord {
  id: string;
  userId: string;
  amount: number;
  currency: "ZAR";
  purpose: string;
  termMonths: number;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "disbursed"
    | "repaid"
    | "cancelled";

  createdAt?: unknown;
  updatedAt?: unknown;

  reviewedBy?: string;
  reviewedAt?: unknown;
  rejectionReason?: string | null;

  disbursedAt?: unknown;
  disbursedBy?: string;

  totalRepaidCents?: number;
  outstandingBalanceCents?: number;
  monthlyInstallmentCents?: number;

  interestRate?: number;

  repaymentSchedule?: {
    installmentNumber: number;
    amountCents: number;
    amount: number;
    dueDate: unknown;
    status: string;
  }[];
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  amountCents: number;
  currency: "ZAR";
  note: string;
  paidAt: unknown;
  recordedBy: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  count?: number;
  loans?: LoanAdminRecord[];
  repayments?: LoanRepayment[];
  repaymentId?: string;
  totalRepaid?: number;
  outstandingBalance?: number;
  status?: string;
}

// ==========================================
// AUTHENTICATED API REQUEST
// ==========================================

async function loanApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" = "GET",
  body?: Record<string, unknown>,
): Promise<T> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in first.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(
    `${API_URL}/api/loans${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );

  const data = await response.json() as ApiResponse;

  if (!response.ok) {
    throw new Error(
      data.message || "Loan Management request failed.",
    );
  }

  return data as T;
}

// ==========================================
// GET ALL LOAN APPLICATIONS
// ==========================================

export async function getAllLoans(): Promise<LoanAdminRecord[]> {
  const data = await loanApiRequest<ApiResponse>("");

  return data.loans ?? [];
}

// ==========================================
// APPROVE LOAN
// ==========================================

export async function approveLoan(
  loanId: string,
): Promise<void> {
  if (!loanId.trim()) {
    throw new Error("A loan ID is required.");
  }

  await loanApiRequest(
    `/${encodeURIComponent(loanId)}/decision`,
    "PATCH",
    {
      decision: "approve",
    },
  );
}

// ==========================================
// REJECT LOAN
// ==========================================

export async function rejectLoan(
  loanId: string,
  reason: string,
): Promise<void> {
  if (!loanId.trim()) {
    throw new Error("A loan ID is required.");
  }

  if (!reason.trim()) {
    throw new Error("Please provide a rejection reason.");
  }

  await loanApiRequest(
    `/${encodeURIComponent(loanId)}/decision`,
    "PATCH",
    {
      decision: "reject",
      reason: reason.trim(),
    },
  );
}

// ==========================================
// RECORD LOAN DISBURSEMENT
// ==========================================

export async function disburseLoan(
  loanId: string,
): Promise<void> {
  if (!loanId.trim()) {
    throw new Error("A loan ID is required.");
  }

  await loanApiRequest(
    `/${encodeURIComponent(loanId)}/disburse`,
    "PATCH",
  );
}

// ==========================================
// RECORD REPAYMENT
// ==========================================

export async function recordRepayment(
  loanId: string,
  amount: number,
  note: string = "",
): Promise<ApiResponse> {
  if (!loanId.trim()) {
    throw new Error("A loan ID is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid repayment amount.");
  }

  return loanApiRequest<ApiResponse>(
    `/${encodeURIComponent(loanId)}/repayments`,
    "POST",
    {
      amount,
      note: note.trim(),
    },
  );
}

// ==========================================
// GET REPAYMENT HISTORY
// ==========================================

export async function getLoanRepayments(
  loanId: string,
): Promise<LoanRepayment[]> {
  if (!loanId.trim()) {
    throw new Error("A loan ID is required.");
  }

  const data = await loanApiRequest<ApiResponse>(
    `/${encodeURIComponent(loanId)}/repayments`,
  );

  return data.repayments ?? [];
}
