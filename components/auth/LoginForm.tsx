"use client";

import { FirebaseError } from "firebase/app";
import {
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

import { createServerSession } from "@/lib/auth/create-session";
import { firebaseAuth } from "@/lib/firebase/client";

type LoginFormProps = {
  returnTo: string;
};

function getLoginError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Unable to sign in. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/user-disabled":
      return "The email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many sign-in attempts. Please wait and try again.";
    default:
      return "Unable to sign in. Please try again.";
  }
}

export function LoginForm({ returnTo }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await setPersistence(firebaseAuth, inMemoryPersistence);

      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      const idToken = await credential.user.getIdToken();

      await createServerSession(idToken);
      await signOut(firebaseAuth);

      router.replace(returnTo);
      router.refresh();
    } catch (error) {
      await signOut(firebaseAuth).catch(() => undefined);
      setErrorMessage(getLoginError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="email"
        >
          Email
        </label>
        <input
          autoComplete="email"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          disabled={isSubmitting}
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          disabled={isSubmitting}
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
