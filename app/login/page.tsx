import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type LoginPageProps = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

function getSafeReturnTo(returnTo: string | string[] | undefined): string {
  if (
    typeof returnTo === "string" &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//")
  ) {
    return returnTo;
  }

  return "/dashboard";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const { returnTo } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Sign in to Waypoint
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Continue organizing your projects and tasks.
          </p>
        </div>

        <LoginForm returnTo={getSafeReturnTo(returnTo)} />

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
            href="/register"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
