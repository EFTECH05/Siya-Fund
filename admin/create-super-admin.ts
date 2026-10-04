import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ==========================================
// INITIALIZE FIREBASE ADMIN
// ==========================================

initializeApp({
  credential: applicationDefault(),
  projectId: "siya-fund",
});

const auth = getAuth();

// ==========================================
// SUPER ADMIN DETAILS
// ==========================================

const email = "franklin@siya-fund.dev";
const password = "frank123";
const displayName = "Franklin";

// ==========================================
// CREATE OR UPDATE SUPER ADMIN
// ==========================================

async function createOrUpdateSuperAdmin() {
  let user;

  try {
    // Check whether the account already exists
    user = await auth.getUserByEmail(email);

    console.log("Super Admin account already exists.");
    console.log("Updating the account...");

    user = await auth.updateUser(user.uid, {
      password,
      displayName,
      emailVerified: true,
    });
  } catch (error: any) {

    // Create the account if it does not exist
    if (error?.code !== "auth/user-not-found") {
      throw error;
    }

    console.log("Super Admin account does not exist.");
    console.log("Creating the account...");

    user = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
  }

  // ==========================================
  // ASSIGN SUPER ADMIN ROLE
  // ==========================================

  await auth.setCustomUserClaims(user.uid, {
    ...(user.customClaims ?? {}),
    role: "super_admin",
  });

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  console.log("");
  console.log("==========================================");
  console.log("SUPER ADMIN READY");
  console.log("==========================================");
  console.log("Email:", email);
  console.log("Role: super_admin");
  console.log("UID:", user.uid);
  console.log("==========================================");
}

createOrUpdateSuperAdmin().catch((error) => {
  console.error("");
  console.error("Failed to create Super Admin:");
  console.error(error);
  process.exit(1);
});