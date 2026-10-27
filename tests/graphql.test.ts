import assert from "node:assert/strict";
import test from "node:test";
import { graphql } from "graphql";

import type { GraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

const updateProjectSource = `
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) { id name description }
  }
`;

function updateContext(
  updateProjectForOwner: GraphQLContext["dataAccess"]["updateProjectForOwner"],
): GraphQLContext {
  return {
    userId: "user-1",
    dataAccess: {
      updateProjectForOwner,
      async createProject() {
        throw new Error("Unexpected create");
      },
      async getProjectsByOwnerId() {
        return [];
      },
      async getProjectByIdForOwner() {
        return null;
      },
      async getTasksByProjectIdForOwner() {
        return [];
      },
      async deleteProjectForOwner() {
        throw new Error("Unexpected delete");
      },
    },
  };
}

test("updateProject uses trusted ownership, trims fields, and preserves omitted fields", async () => {
  const cases = [
    { input: { name: "  Renamed  " }, expected: { name: "Renamed" } },
    {
      input: { description: "  Revised  " },
      expected: { description: "Revised" },
    },
    { input: { description: null }, expected: { description: null } },
    { input: { description: "   " }, expected: { description: null } },
    {
      input: { name: "Renamed", description: "Revised" },
      expected: { name: "Renamed", description: "Revised" },
    },
  ];

  for (const { input, expected } of cases) {
    let writes = 0;
    const context = updateContext(async (ownerId, projectId, update) => {
      writes++;
      assert.equal(ownerId, "user-1");
      assert.equal(projectId, "project-1");
      assert.deepEqual(update, expected);
      return {
        id: projectId,
        ownerId,
        name: update.name ?? "Original",
        description:
          update.description === undefined
            ? "Original description"
            : (update.description ?? ""),
        createdAt: "2026-09-29T00:00:00.000Z",
        updatedAt: "2026-09-29T01:00:00.000Z",
      };
    });
    const result = await graphql({
      schema,
      source: updateProjectSource,
      contextValue: context,
      variableValues: { id: "project-1", input },
    });
    assert.equal(result.errors, undefined);
    assert.equal(writes, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(result.data)), {
      updateProject: {
        id: "project-1",
        name: expected.name ?? "Original",
        description:
          expected.description === undefined
            ? "Original description"
            : (expected.description ?? ""),
      },
    });
  }
});

test("updateProject rejects invalid input before writing", async () => {
  let writes = 0;
  const context = updateContext(async () => {
    writes++;
    return null;
  });
  for (const input of [
    {},
    { name: null },
    { name: "   " },
    { name: "x".repeat(121) },
    { description: "x".repeat(501) },
  ]) {
    const result = await graphql({
      schema,
      source: updateProjectSource,
      contextValue: context,
      variableValues: { id: "project-1", input },
    });
    assert.equal(result.errors?.[0]?.extensions.code, "BAD_USER_INPUT");
  }
  assert.equal(writes, 0);
});

test("updateProject returns NOT_FOUND for missing or inaccessible projects", async () => {
  const context = updateContext(async (ownerId, projectId) => {
    assert.equal(ownerId, "user-1");
    assert.ok(["missing-project", "other-project"].includes(projectId));
    return null;
  });
  for (const id of ["missing-project", "other-project"]) {
    const result = await graphql({
      schema,
      source: updateProjectSource,
      contextValue: context,
      variableValues: { id, input: { name: "Renamed" } },
    });
    assert.equal(result.errors?.[0]?.extensions.code, "NOT_FOUND");
    assert.equal(result.data, null);
  }
});

test("updateProject does not accept a client-supplied owner ID", async () => {
  const context = updateContext(async () => {
    throw new Error("Should not write");
  });
  const result = await graphql({
    schema,
    source: updateProjectSource,
    contextValue: context,
    variableValues: {
      id: "project-1",
      input: { name: "Renamed", ownerId: "other-user" },
    },
  });
  assert.ok(result.errors?.length);
});

test("projects uses the trusted context user ID", async () => {
  let receivedOwnerId: string | undefined;

  const context: GraphQLContext = {
    userId: "user-1",
    dataAccess: {
      async updateProjectForOwner() {
        throw new Error("Unexpected update");
      },
      async createProject() {
        throw new Error("Unexpected mutation");
      },
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
      async deleteProjectForOwner() {
        throw new Error("Unexpected delete");
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
      async updateProjectForOwner() {
        throw new Error("Unexpected update");
      },
      async createProject() {
        throw new Error("Unexpected mutation");
      },
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
      async deleteProjectForOwner() {
        throw new Error("Unexpected delete");
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
      async updateProjectForOwner() {
        throw new Error("Unexpected update");
      },
      async createProject() {
        throw new Error("Unexpected mutation");
      },
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

      async deleteProjectForOwner() {
        throw new Error("Unexpected delete");
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

test("createProject validates input and uses the trusted context user ID", async () => {
  let writes = 0;
  const context: GraphQLContext = {
    userId: "user-1",
    dataAccess: {
      async updateProjectForOwner() {
        throw new Error("Unexpected update");
      },
      async createProject(ownerId, input) {
        writes++;
        assert.equal(ownerId, "user-1");
        assert.deepEqual(input, { name: "New project", description: null });
        return {
          id: "project-2",
          ownerId,
          name: input.name,
          description: "",
          createdAt: "2026-09-29T00:00:00.000Z",
          updatedAt: "2026-09-29T00:00:00.000Z",
        };
      },
      async getProjectsByOwnerId() {
        return [];
      },
      async getProjectByIdForOwner() {
        return null;
      },
      async getTasksByProjectIdForOwner() {
        return [];
      },
      async deleteProjectForOwner() {
        throw new Error("Unexpected delete");
      },
    },
  };

  const source = `mutation Create($input: CreateProjectInput!) {
    createProject(input: $input) { id name description }
  }`;

  const invalid = await graphql({
    schema,
    source,
    contextValue: context,
    variableValues: { input: { name: "   " } },
  });
  assert.equal(invalid.errors?.[0]?.extensions.code, "BAD_USER_INPUT");
  assert.equal(writes, 0);

  const result = await graphql({
    schema,
    source,
    contextValue: context,
    variableValues: { input: { name: "  New project  " } },
  });
  assert.equal(result.errors, undefined);
  assert.equal(writes, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(result.data)), {
    createProject: { id: "project-2", name: "New project", description: "" },
  });

  function deleteContext(
    deleteProjectForOwner: GraphQLContext["dataAccess"]["deleteProjectForOwner"],
  ): GraphQLContext {
    return {
      userId: "user-1",
      dataAccess: {
        deleteProjectForOwner,
        async createProject() {
          throw new Error("Unexpected create");
        },
        async updateProjectForOwner() {
          throw new Error("Unexpected update");
        },
        async getProjectsByOwnerId() {
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
  }

  const deleteProjectMutation = `
      mutation DeleteProject($id: ID!) {
        deleteProject(id: $id)
      }
    `;

  test("deleteProject uses the trusted user ID and returns true", async () => {
    const context = deleteContext(async (getProjectsByOwnerId, projectId) => {
      assert.equal(getProjectsByOwnerId, "user-1");
      assert.equal(projectId, "project-1");
      return true;
    });

    const result = await graphql({
      schema,
      source: deleteProjectMutation,
      contextValue: context,
      variableValues: { id: "project-1" },
    });

    assert.equal(result.errors, undefined);
    assert.deepEqual(JSON.parse(JSON.stringify(result.data)), {
      deleteProject: true,
    });
  });

  test("deleteProject returns NOT_FOUND when the project cannot be deleted", async () => {
    const context = deleteContext(async (ownerId, projectId) => {
      assert.equal(ownerId, "user-1");
      assert.equal(projectId, "other-project");
      return false;
    });

    const result = await graphql({
      schema,
      source: deleteProjectMutation,
      contextValue: context,
      variableValues: { id: "other-project" },
    });

    assert.equal(result.errors?.[0]?.extensions.code, "NOT_FOUND");
    assert.equal(result.data, null);
  });
});
