import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const developmentUserId = process.env.WAYPOINT_DEV_USER_ID;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

if (!developmentUserId) {
  throw new Error("WAYPOINT_DEV_USER_ID is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "dev@waypoint.local",
    },
    update: {
      id: developmentUserId,
      name: "Development User",
    },
    create: {
      id: developmentUserId,
      name: "Development User",
      email: "dev@waypoint.local",
    },
  });
  console.log(`Seeded development user: ${user.email} (${user.id})`);

  const project = await prisma.project.upsert({
    where: {
      id: "00000000-0000-4000-8000-000000000101",
    },
    update: {
      ownerId: user.id,
      name: "GraphQL Foundation",
      description: "Introduce a read-only GraphQL API to Waypoint.",
    },
    create: {
      id: "00000000-0000-4000-8000-000000000101",
      ownerId: user.id,
      name: "GraphQL Foundation",
      description: "Introduce a read-only GraphQL API to Waypoint.",
    },
  });
  console.log(`Seeded project ${project.name} (${project.id})`);

  const task = await prisma.task.upsert({
    where: {
      id: "00000000-0000-4000-8000-000000000201",
    },
    update: {
      projectId: project.id,
      title: "Connect project queries",
      description: "Read projects and tasks through GraphQL.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: null,
    },
    create: {
      id: "00000000-0000-4000-8000-000000000201",
      projectId: project.id,
      title: "Connect project queries",
      description: "Read projects and tasks through GraphQL.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: null,
    },
  });
  console.log(`Seeded task ${task.title} (${task.id})`);

  const otherUser = await prisma.user.upsert({
    where: {
      email: "other@waypoint.local",
    },
    update: {
      id: "00000000-0000-4000-8000-000000000002",
      name: "Other Development User",
    },
    create: {
      id: "00000000-0000-4000-8000-000000000002",
      name: "Other Development User",
      email: "other@waypoint.local",
    },
  });

  await prisma.project.upsert({
    where: {
      id: "00000000-0000-4000-8000-000000000102",
    },
    update: {
      ownerId: otherUser.id,
      name: "Private Project",
      description: "Owned by a different user.",
    },
    create: {
      id: "00000000-0000-4000-8000-000000000102",
      ownerId: otherUser.id,
      name: "Private Project",
      description: "Owned by a different user.",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
