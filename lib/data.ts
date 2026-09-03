import "server-only";

import type {
  Project as PrismaProject,
  Task as PrismaTask,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Project, Task, TaskPriority, TaskStatus } from "@/lib/types";
import { mockProjects, mockTasks } from "@/lib/mock-data";

function mapProject(project: PrismaProject): Project {
  return {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    description: project.description ?? "",
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

const taskStatusMap: Record<PrismaTask["status"], TaskStatus> = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

const taskPriorityMap: Record<PrismaTask["priority"], TaskPriority> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

function mapTask(task: PrismaTask): Task {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description ?? "",
    status: taskStatusMap[task.status],
    priority: taskPriorityMap[task.priority],
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function getProjectsByOwnerId(
  ownerId: string,
): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return projects.map(mapProject);
}

export async function getProjectByIdForOwner(
  ownerId: string,
  projectId: string,
): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
  });

  return project ? mapProject(project) : null;
}

export async function getTasksByProjectIdForOwner(
  ownerId: string,
  projectId: string,
): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      project: {
        ownerId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return tasks.map(mapTask);
}

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
