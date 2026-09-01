export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
