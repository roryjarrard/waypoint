import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link
            className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            href="/dashboard"
          >
            Waypoint
          </Link>

          <SignOutButton />
        </div>
      </header>

      {children}
    </>
  );
}
