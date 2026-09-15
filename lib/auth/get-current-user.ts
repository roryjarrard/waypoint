import "server-only";

import { prisma } from "@/lib/prisma";

import { getFirebaseSession } from "./get-firebase-session";

type FirebaseIdentity = {
  uid: string;
  email?: string;
  name?: string;
};

export async function provisionWaypointUser(identity: FirebaseIdentity) {
  const existingUser = await prisma.user.findUnique({
    where: {
      authProviderId: identity.uid,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  if (!identity.email) {
    throw new Error(
      "The authenticated Firebase account does not have an email address.",
    );
  }

  try {
    return await prisma.user.create({
      data: {
        authProviderId: identity.uid,
        email: identity.email,
        name: typeof identity.name === "string" ? identity.name : null,
      },
    });
  } catch (error) {
    // Another concurrent request may have provisioned the user
    // after the initial lookup.
    const concurrentlyCreatedUser = await prisma.user.findUnique({
      where: {
        authProviderId: identity.uid,
      },
    });

    if (concurrentlyCreatedUser) {
      return concurrentlyCreatedUser;
    }

    throw error;
  }
}

export async function getCurrentUser() {
  const firebaseSession = await getFirebaseSession();

  if (!firebaseSession) {
    return null;
  }

  return provisionWaypointUser(firebaseSession);
}
