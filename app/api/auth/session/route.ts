import { NextResponse } from "next/server";

import {
  RECENT_SIGN_IN_SECONDS,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MILLISECONDS,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth/session";
import { firebaseAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("idToken" in body) ||
    typeof body.idToken !== "string" ||
    body.idToken.length === 0
  ) {
    return NextResponse.json(
      { error: "An ID token is required." },
      { status: 400 },
    );
  }

  try {
    const decodedToken = await firebaseAdminAuth.verifyIdToken(body.idToken);

    const secondsSinceSignIn =
      Math.floor(Date.now() / 1000) - decodedToken.auth_time;

    if (secondsSinceSignIn > RECENT_SIGN_IN_SECONDS) {
      return NextResponse.json(
        { error: "Recent sign-in is required." },
        { status: 401 },
      );
    }

    const sessionCookie = await firebaseAdminAuth.createSessionCookie(
      body.idToken,
      {
        expiresIn: SESSION_DURATION_MILLISECONDS,
      },
    );

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication failed." },
      { status: 401 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
