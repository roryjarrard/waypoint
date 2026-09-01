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
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        <Link
          href={`/projects/${project.id}`}
          className="hover:underline focus-visible:underline focus-visible:outline-none"
        >
          {project.name}
        </Link>
      </h2>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {project.description}
      </p>
      <p className="mt-auto text-sm text-zinc-600 dark:text-zinc-400">
        {completedTaskCount} of {totalTaskCount} tasks complete
      </p>
    </div>
  );
}
