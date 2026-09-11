import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const firebaseAdminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: requireEnvironmentVariable("FIREBASE_ADMIN_PROJECT_ID"),
          clientEmail: requireEnvironmentVariable(
            "FIREBASE_ADMIN_CLIENT_EMAIL",
          ),
          privateKey: requireEnvironmentVariable(
            "FIREBASE_ADMIN_PRIVATE_KEY",
          ).replace(/\\n/g, "\n"),
        }),
      });

export const firebaseAdminAuth = getAuth(firebaseAdminApp);
