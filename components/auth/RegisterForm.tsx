"use client";

import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  setPersistence,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

import { createServerSession } from "@/lib/auth/create-session";
import { firebaseAuth } from "@/lib/firebase/client";

function getRegistrationError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Unable to create your account. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account already exists for this email address.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Choose a password with at least six characters.";
    default:
      return "Unable to create your account. Please try again.";
  }
}

export function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await setPersistence(firebaseAuth, inMemoryPersistence);

      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      const idToken = await credential.user.getIdToken();

      await createServerSession(idToken);
      await signOut(firebaseAuth);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      await signOut(firebaseAuth).catch(() => undefined);
      setErrorMessage(getRegistrationError(error));
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
          autoComplete="new-password"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          disabled={isSubmitting}
          id="password"
          minLength={6}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="password-confirmation"
        >
          Confirm password
        </label>
        <input
          autoComplete="new-password"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          disabled={isSubmitting}
          id="password-confirmation"
          minLength={6}
          name="passwordConfirmation"
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          required
          type="password"
          value={passwordConfirmation}
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
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
