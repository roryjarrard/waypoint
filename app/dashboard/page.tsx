import { Suspense } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects, getTasksByProjectId } from "@/lib/data";

async function ProjectsGrid() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No projects yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {await Promise.all(
        projects.map(async (project) => {
          const projectTasks = await getTasksByProjectId(project.id);
          const completedTaskCount = projectTasks.filter(
            (task) => task.status === "done",
          ).length;

          return (
            <ProjectCard
              key={project.id}
              project={project}
              completedTaskCount={completedTaskCount}
              totalTaskCount={projectTasks.length}
            />
          );
        }),
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Projects
        </h1>
        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          An overview of your active projects and their progress.
        </p>
      </div>

      <Suspense
        fallback={
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Loading your projects...
          </p>
        }
      >
        <ProjectsGrid />
      </Suspense>
    </main>
  );
}
