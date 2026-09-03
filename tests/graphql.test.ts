import assert from "node:assert/strict";
import test from "node:test";
import { graphql } from "graphql";

import type { GraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

test("projects uses the trusted context user ID", async () => {
  let receivedOwnerId: string | undefined;

  const context: GraphQLContext = {
    userId: "user-1",
    dataAccess: {
      async getProjectsByOwnerId(ownerId) {
        receivedOwnerId = ownerId;
        return [];
      },

      async getProjectByIdForOwner() {
        return null;
      },

      async getTasksByProjectIdForOwner() {
        return [];
      },
    },
  };

  const result = await graphql({
    schema,
    source: `
        query {
            projects {
                id
                name
            }
        }
        `,
    contextValue: context,
  });

  assert.equal(result.errors, undefined);
  assert.equal(receivedOwnerId, "user-1");
  assert.deepEqual(JSON.parse(JSON.stringify(result.data)), { projects: [] });
});

test("returns an owned project with its tasks", async () => {
  const context: GraphQLContext = {
    userId: "user-1",
    dataAccess: {
      async getProjectsByOwnerId() {
        return [];
      },

      async getProjectByIdForOwner(ownerId, projectId) {
        assert.equal(ownerId, "user-1");
        assert.equal(projectId, "project-1");

        return {
          id: "project-1",
          ownerId: "user-1",
          name: "GraphQL Foundation",
          description: "Build the read-only API.",
          createdAt: "2026-09-03T00:00:00.000Z",
          updatedAt: "2026-09-03T00:00:00.000Z",
        };
      },

      async getTasksByProjectIdForOwner(ownerId, projectId) {
        assert.equal(ownerId, "user-1");
        assert.equal(projectId, "project-1");

        return [
          {
            id: "task-1",
            projectId: "project-1",
            title: "Connect project queries",
            description: "Read projects and tasks through GraphQL.",
            status: "in-progress",
            priority: "high",
            dueDate: null,
            createdAt: "2026-09-03T00:00:00.000Z",
            updatedAt: "2026-09-03T00:00:00.000Z",
          },
        ];
      },
    },
  };

  const result = await graphql({
    schema,
    source: `
      query {
        project(id: "project-1") {
          id
          name
          tasks {
            id
            title
            status
            priority
          }
        }
      }
    `,
    contextValue: context,
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(result.data)), {
    project: {
      id: "project-1",
      name: "GraphQL Foundation",
      tasks: [
        {
          id: "task-1",
          title: "Connect project queries",
          status: "in-progress",
          priority: "high",
        },
      ],
    },
  });
});

test("does not return a project owned by another user", async () => {
  const context: GraphQLContext = {
    userId: "user-1",
    dataAccess: {
      async getProjectsByOwnerId() {
        return [];
      },

      async getProjectByIdForOwner(ownerId, projectId) {
        assert.equal(ownerId, "user-1");
        assert.equal(projectId, "other-project");

        return null;
      },

      async getTasksByProjectIdForOwner() {
        throw new Error(
          "Tasks should not be queried for an inaccessible project",
        );
      },
    },
  };

  const result = await graphql({
    schema,
    source: `
      query {
        project(id: "other-project") {
          id
          name
          tasks {
            id
          }
        }
      }
    `,
    contextValue: context,
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(result.data)), { project: null });
});
