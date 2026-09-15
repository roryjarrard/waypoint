import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Waypoint
        </h1>

        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          A focused way to track projects and tasks from start to finish.
        </p>

        <Link
          href="/login"
          className="mt-4 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:outline-zinc-100"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
