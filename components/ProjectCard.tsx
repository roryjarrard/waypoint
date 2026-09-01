import Link from "next/link";
import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
  completedTaskCount: number;
  totalTaskCount: number;
};

export function ProjectCard({
  project,
  completedTaskCount,
  totalTaskCount,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-5 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:focus-visible:outline-zinc-50"
    >
      <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {project.name}
      </h2>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {project.description}
      </p>
      <p className="mt-auto text-sm text-zinc-600 dark:text-zinc-400">
        {totalTaskCount === 0
          ? "No tasks yet"
          : `${completedTaskCount} of ${totalTaskCount} tasks complete`}
      </p>
    </Link>
  );
}
