import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Project not found
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            We couldn&apos;t open this project
          </h1>

          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            It may have been removed, or you may not have access to it.
          </p>
        </div>

        <Link
          className="mt-6 inline-flex rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
