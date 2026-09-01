import type { Project, Task, User } from "@/lib/types";

export const mockUser: User = {
  id: "user-1",
  name: "Rory Jarrard",
  email: "rory@example.com",
  createdAt: "2026-08-15T16:00:00.000Z",
  updatedAt: "2026-08-15T16:00:00.000Z",
};

export const mockProjects: Project[] = [
  {
    id: "project-1",
    ownerId: mockUser.id,
    name: "Website Redesign",
    description:
      "Refresh the company website with clearer navigation, updated content, and a responsive design system.",
    createdAt: "2026-08-16T15:00:00.000Z",
    updatedAt: "2026-08-29T18:30:00.000Z",
  },
  {
    id: "project-2",
    ownerId: mockUser.id,
    name: "Mobile App Launch",
    description:
      "Prepare the mobile application for its first public release across iOS and Android.",
    createdAt: "2026-08-20T17:15:00.000Z",
    updatedAt: "2026-08-31T20:00:00.000Z",
  },
  {
    id: "project-3",
    ownerId: mockUser.id,
    name: "Quarterly Planning",
    description:
      "Define priorities and expected outcomes for the upcoming quarter.",
    createdAt: "2026-09-01T14:00:00.000Z",
    updatedAt: "2026-09-01T14:00:00.000Z",
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Audit existing site content",
    description:
      "Review current pages and identify content to keep, revise, or remove.",
    status: "done",
    priority: "medium",
    dueDate: "2026-08-25T23:59:59.000Z",
    createdAt: "2026-08-16T16:00:00.000Z",
    updatedAt: "2026-08-24T19:45:00.000Z",
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Create navigation prototype",
    description:
      "Build and review a responsive prototype for the primary site navigation.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-09-05T23:59:59.000Z",
    createdAt: "2026-08-18T15:30:00.000Z",
    updatedAt: "2026-08-30T21:10:00.000Z",
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Define typography scale",
    description:
      "Choose type sizes and line heights for headings, body text, and supporting content.",
    status: "todo",
    priority: "low",
    dueDate: null,
    createdAt: "2026-08-21T18:00:00.000Z",
    updatedAt: "2026-08-21T18:00:00.000Z",
  },
  {
    id: "task-4",
    projectId: "project-1",
    title: "Implement responsive homepage",
    description:
      "Build the approved homepage design and verify it across common viewport sizes.",
    status: "todo",
    priority: "high",
    dueDate: "2026-09-12T23:59:59.000Z",
    createdAt: "2026-08-23T14:20:00.000Z",
    updatedAt: "2026-08-23T14:20:00.000Z",
  },
  {
    id: "task-5",
    projectId: "project-2",
    title: "Finalize store listing copy",
    description:
      "Prepare the title, description, keywords, and release notes for both app stores.",
    status: "done",
    priority: "medium",
    dueDate: "2026-08-28T23:59:59.000Z",
    createdAt: "2026-08-20T18:00:00.000Z",
    updatedAt: "2026-08-28T16:30:00.000Z",
  },
  {
    id: "task-6",
    projectId: "project-2",
    title: "Complete release candidate testing",
    description:
      "Run the release checklist on supported iOS and Android devices and document defects.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-09-03T23:59:59.000Z",
    createdAt: "2026-08-22T17:45:00.000Z",
    updatedAt: "2026-08-31T22:15:00.000Z",
  },
  {
    id: "task-7",
    projectId: "project-2",
    title: "Prepare launch analytics dashboard",
    description:
      "Create a dashboard for installs, activation, crashes, and first-week retention.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-09-08T23:59:59.000Z",
    createdAt: "2026-08-25T19:10:00.000Z",
    updatedAt: "2026-08-25T19:10:00.000Z",
  },
];
