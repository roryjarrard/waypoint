import type { Project, Task } from "@/lib/types";
import { mockProjects, mockTasks } from "@/lib/mock-data";

export async function getProjects(): Promise<Project[]> {
  return mockProjects;
}

export async function getProjectById(
  projectId: string,
): Promise<Project | undefined> {
  return mockProjects.find((project) => project.id === projectId);
}

export async function getTasksByProjectId(projectId: string): Promise<Task[]> {
  return mockTasks.filter((task) => task.projectId === projectId);
}
