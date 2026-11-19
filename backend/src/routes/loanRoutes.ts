
import { Router } from "express";

import {
  verifyFirebaseToken,
  requireSuperAdmin,
} from "../middleware/authMiddleware";

import {
  getAllLoans,
  reviewLoan,
  disburseLoan,
  recordRepayment,
  getLoanRepayments,
} from "../controllers/loanController";

const router = Router();

// Verify Firebase authentication.
router.use(verifyFirebaseToken);

// Restrict loan administration to Super Admin.
router.use(requireSuperAdmin);

// Retrieve all loan applications.
router.get("/", getAllLoans);

// Approve or reject an application.
router.patch("/:loanId/decision", reviewLoan);

// Record loan disbursement.
router.patch("/:loanId/disburse", disburseLoan);

// Record a repayment.
router.post("/:loanId/repayments", recordRepayment);

// Retrieve repayment history.
router.get("/:loanId/repayments", getLoanRepayments);

export default router;
