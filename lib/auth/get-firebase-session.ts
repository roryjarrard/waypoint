import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";

import { firebaseAdminAuth } from "@/lib/firebase/admin";

import { SESSION_COOKIE_NAME } from "./session";

export async function getFirebaseSession(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    return await firebaseAdminAuth.verifySessionCookie(sessionCookie);
  } catch {
    return null;
  }
}
