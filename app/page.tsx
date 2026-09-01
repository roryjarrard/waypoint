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
      </div>
    </main>
  );
}
