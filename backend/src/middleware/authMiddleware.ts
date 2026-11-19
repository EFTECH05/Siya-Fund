
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  adminAuth,
} from "../services/FirebaseAdminService";

// ==========================================
// AUTHENTICATED REQUEST TYPE
// ==========================================

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

// ==========================================
// VERIFY FIREBASE ID TOKEN
// ==========================================

export async function verifyFirebaseToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorizationHeader = req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        message: "Authentication required.",
      });
      return;
    }

    const idToken = authorizationHeader.substring(7);

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}

// ==========================================
// REQUIRE SUPER ADMIN ROLE
// ==========================================

export function requireSuperAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "super_admin") {
    res.status(403).json({
      message: "Access denied. Super Admin privileges required.",
    });
    return;
  }

  next();
}
