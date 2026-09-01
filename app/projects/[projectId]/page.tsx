import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskPriorityBadge } from "@/components/TaskPriorityBadge";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { getProjectById, getTasksByProjectId } from "@/lib/data";

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[projectId]">) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const projectTasks = await getTasksByProjectId(project.id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        &larr; Back to dashboard
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {project.name}
        </h1>
        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Tasks
        </h2>

        {projectTasks.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No tasks yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {projectTasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <TaskStatusBadge status={task.status} />
                    <TaskPriorityBadge priority={task.priority} />
                  </div>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {task.description}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Due{" "}
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
