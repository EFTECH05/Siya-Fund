
import type {
  Request,
  Response,
} from "express";

import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminDb,
} from "../services/FirebaseAdminService";

import type {
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

// ==========================================
// COLLECTIONS
// ==========================================

const LOANS_COLLECTION = "loans";

// ==========================================
// HELPER: CONVERT AMOUNT TO CENTS
// ==========================================

function toCents(value: unknown): number {
  const amount = Number(value);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    Math.round(amount * 100) !== amount * 100
  ) {
    throw new Error(
      "Enter a valid amount greater than zero, with no more than two decimal places.",
    );
  }

  return Math.round(amount * 100);
}

// ==========================================
// HELPER: GENERATE MONTHLY REPAYMENT SCHEDULE
// ==========================================

function generateRepaymentSchedule(
  principalCents: number,
  termMonths: number,
  disbursementDate: Date,
) {
  const baseInstallment = Math.floor(
    principalCents / termMonths,
  );

  const remainder = principalCents % termMonths;

  return Array.from(
    { length: termMonths },
    (_, index) => {
      const dueDate = new Date(disbursementDate);
      const originalDay = dueDate.getUTCDate();

      dueDate.setUTCDate(1);

      dueDate.setUTCMonth(
        dueDate.getUTCMonth() + index + 1,
      );

      const lastDayOfMonth = new Date(
        Date.UTC(
          dueDate.getUTCFullYear(),
          dueDate.getUTCMonth() + 1,
          0,
        ),
      ).getUTCDate();

      dueDate.setUTCDate(
        Math.min(originalDay, lastDayOfMonth),
      );

      const installmentCents =
        baseInstallment +
        (index === termMonths - 1 ? remainder : 0);

      return {
        installmentNumber: index + 1,
        amountCents: installmentCents,
        amount: installmentCents / 100,
        dueDate: Timestamp.fromDate(dueDate),
        status: "pending",
      };
    },
  );
}

// ==========================================
// GET ALL LOAN APPLICATIONS
// SUPER ADMIN ONLY
// ==========================================

export async function getAllLoans(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const snapshot = await adminDb
      .collection(LOANS_COLLECTION)
      .get();

    const loans = snapshot.docs.map((document) => {
      const data = document.data();

      return {
        id: document.id,
        ...data,
        createdAt: data.createdAt,
      };
    });

    loans.sort((a, b) => {
      const dateA =
        a.createdAt instanceof Timestamp
          ? a.createdAt.toMillis()
          : 0;

      const dateB =
        b.createdAt instanceof Timestamp
          ? b.createdAt.toMillis()
          : 0;

      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      count: loans.length,
      loans,
    });
  } catch (error) {
    console.error("Get loans error:", error);

    res.status(500).json({
      message: "Unable to retrieve loan applications.",
    });
  }
}

// ==========================================
// APPROVE OR REJECT LOAN
// SUPER ADMIN ONLY
// ==========================================

export async function reviewLoan(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const loanId = String(req.params.loanId ?? "");

    const { decision, reason } = req.body;

    if (
      decision !== "approve" &&
      decision !== "reject"
    ) {
      res.status(400).json({
        message: "Decision must be approve or reject.",
      });
      return;
    }

    if (
      decision === "reject" &&
      (typeof reason !== "string" || !reason.trim())
    ) {
      res.status(400).json({
        message: "Please provide a rejection reason.",
      });
      return;
    }

    const loanRef = adminDb
      .collection(LOANS_COLLECTION)
      .doc(loanId);

    await adminDb.runTransaction(async (transaction) => {
      const loanSnapshot = await transaction.get(loanRef);

      if (!loanSnapshot.exists) {
        throw new Error("LOAN_NOT_FOUND");
      }

      const loan = loanSnapshot.data()!;

      if (loan.status !== "pending") {
        throw new Error("LOAN_NOT_PENDING");
      }

      transaction.update(loanRef, {
        status:
          decision === "approve"
            ? "approved"
            : "rejected",

        reviewedBy: req.user!.uid,

        reviewedAt: FieldValue.serverTimestamp(),

        rejectionReason:
          decision === "reject"
            ? reason.trim()
            : null,

        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({
      success: true,
      message:
        decision === "approve"
          ? "Loan application approved."
          : "Loan application rejected.",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "LOAN_NOT_FOUND") {
        res.status(404).json({
          message: "Loan application not found.",
        });
        return;
      }

      if (error.message === "LOAN_NOT_PENDING") {
        res.status(409).json({
          message: "This loan application has already been reviewed.",
        });
        return;
      }
    }

    console.error("Review loan error:", error);

    res.status(500).json({
      message: "Unable to review loan application.",
    });
  }
}

// ==========================================
// RECORD LOAN DISBURSEMENT
// SUPER ADMIN ONLY
// ==========================================

export async function disburseLoan(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const loanId = String(req.params.loanId ?? "");

    const loanRef = adminDb
      .collection(LOANS_COLLECTION)
      .doc(loanId);

    const disbursementDate = new Date();

    await adminDb.runTransaction(async (transaction) => {
      const loanSnapshot = await transaction.get(loanRef);

      if (!loanSnapshot.exists) {
        throw new Error("LOAN_NOT_FOUND");
      }

      const loan = loanSnapshot.data()!;

      if (loan.status !== "approved") {
        throw new Error("LOAN_NOT_APPROVED");
      }

      const principalCents = toCents(loan.amount);

      const termMonths = Number(loan.termMonths);

      if (
        !Number.isInteger(termMonths) ||
        termMonths < 1 ||
        termMonths > 120
      ) {
        throw new Error("INVALID_LOAN_TERM");
      }

      const repaymentSchedule =
        generateRepaymentSchedule(
          principalCents,
          termMonths,
          disbursementDate,
        );

      transaction.update(loanRef, {
        status: "disbursed",

        disbursedAt:
          Timestamp.fromDate(disbursementDate),

        disbursedBy: req.user!.uid,

        totalRepaidCents: 0,

        outstandingBalanceCents: principalCents,

        monthlyInstallmentCents:
          Math.floor(principalCents / termMonths),

        repaymentSchedule,

        interestRate: 0,

        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({
      success: true,
      message: "Loan disbursement recorded successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "LOAN_NOT_FOUND") {
        res.status(404).json({
          message: "Loan application not found.",
        });
        return;
      }

      if (error.message === "LOAN_NOT_APPROVED") {
        res.status(409).json({
          message: "Only approved loans can be disbursed.",
        });
        return;
      }

      if (error.message === "INVALID_LOAN_TERM") {
        res.status(400).json({
          message: "The loan has an invalid repayment term.",
        });
        return;
      }

      if (error.message.startsWith("Enter a valid amount")) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
    }

    console.error("Disbursement error:", error);

    res.status(500).json({
      message: "Unable to record loan disbursement.",
    });
  }
}

// ==========================================
// RECORD LOAN REPAYMENT
// SUPER ADMIN ONLY
// ==========================================

export async function recordRepayment(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const loanId = String(req.params.loanId ?? "");

    const amountCents = toCents(req.body.amount);

    const note =
      typeof req.body.note === "string"
        ? req.body.note.trim()
        : "";

    const loanRef = adminDb
      .collection(LOANS_COLLECTION)
      .doc(loanId);

    const repaymentRef = loanRef
      .collection("repayments")
      .doc();

    const paidAt = Timestamp.now();

    const result = await adminDb.runTransaction(
      async (transaction) => {
        const loanSnapshot = await transaction.get(loanRef);

        if (!loanSnapshot.exists) {
          throw new Error("LOAN_NOT_FOUND");
        }

        const loan = loanSnapshot.data()!;

        if (loan.status !== "disbursed") {
          throw new Error("LOAN_NOT_DISBURSED");
        }

        const principalCents = toCents(loan.amount);

        const totalRepaidCents = Number(
          loan.totalRepaidCents ?? 0,
        );

        const outstandingBalanceCents = Number(
          loan.outstandingBalanceCents ??
            principalCents - totalRepaidCents,
        );

        if (
          !Number.isInteger(totalRepaidCents) ||
          !Number.isInteger(outstandingBalanceCents) ||
          outstandingBalanceCents <= 0
        ) {
          throw new Error("INVALID_LOAN_BALANCE");
        }

        if (amountCents > outstandingBalanceCents) {
          throw new Error("OVERPAYMENT");
        }

        const newTotalRepaidCents =
          totalRepaidCents + amountCents;

        const newOutstandingBalanceCents =
          outstandingBalanceCents - amountCents;

        const fullyRepaid =
          newOutstandingBalanceCents === 0;

        transaction.create(repaymentRef, {
          loanId,

          userId: loan.userId,

          amount: amountCents / 100,

          amountCents,

          currency: "ZAR",

          note,

          paidAt,

          recordedBy: req.user!.uid,

          createdAt: FieldValue.serverTimestamp(),
        });

        transaction.update(loanRef, {
          totalRepaidCents: newTotalRepaidCents,

          outstandingBalanceCents:
            newOutstandingBalanceCents,

          status: fullyRepaid
            ? "repaid"
            : "disbursed",

          updatedAt: FieldValue.serverTimestamp(),
        });

        return {
          totalRepaidCents: newTotalRepaidCents,

          outstandingBalanceCents:
            newOutstandingBalanceCents,

          status: fullyRepaid
            ? "repaid"
            : "disbursed",
        };
      },
    );

    res.status(201).json({
      success: true,

      message: "Repayment recorded successfully.",

      repaymentId: repaymentRef.id,

      totalRepaid:
        result.totalRepaidCents / 100,

      outstandingBalance:
        result.outstandingBalanceCents / 100,

      status: result.status,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "LOAN_NOT_FOUND") {
        res.status(404).json({
          message: "Loan not found.",
        });
        return;
      }

      if (error.message === "LOAN_NOT_DISBURSED") {
        res.status(409).json({
          message: "Repayments can only be recorded for disbursed loans.",
        });
        return;
      }

      if (error.message === "OVERPAYMENT") {
        res.status(400).json({
          message: "Repayment exceeds the outstanding loan balance.",
        });
        return;
      }

      if (error.message === "INVALID_LOAN_BALANCE") {
        res.status(409).json({
          message: "The loan balance is invalid or already settled.",
        });
        return;
      }

      if (error.message.startsWith("Enter a valid amount")) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
    }

    console.error("Record repayment error:", error);

    res.status(500).json({
      message: "Unable to record repayment.",
    });
  }
}

// ==========================================
// GET LOAN REPAYMENTS
// SUPER ADMIN ONLY
// ==========================================

export async function getLoanRepayments(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const loanId = String(req.params.loanId ?? "");

    const loanRef = adminDb
      .collection(LOANS_COLLECTION)
      .doc(loanId);

    const loanSnapshot = await loanRef.get();

    if (!loanSnapshot.exists) {
      res.status(404).json({
        message: "Loan not found.",
      });
      return;
    }

    const snapshot = await loanRef
      .collection("repayments")
      .orderBy("paidAt", "desc")
      .get();

    const repayments = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    res.status(200).json({
      success: true,
      count: repayments.length,
      repayments,
    });
  } catch (error) {
    console.error("Get repayments error:", error);

    res.status(500).json({
      message: "Unable to retrieve loan repayments.",
    });
  }
}

