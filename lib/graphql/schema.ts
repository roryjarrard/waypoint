import { createSchema } from "graphql-yoga";
import { GraphQLError } from "graphql";
import type { GraphQLContext } from "./context";
import type { Project } from "../types";

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Query {
      projects: [Project!]!
      project(id: ID!): Project
    }

    input CreateProjectInput {
      name: String!
      description: String
    }

    input UpdateProjectInput {
      name: String
      description: String
    }

    type Mutation {
      createProject(input: CreateProjectInput!): Project!
      updateProject(id: ID!, input: UpdateProjectInput!): Project!
      deleteProject(id: ID!): Boolean!
    }

    type Project {
      id: ID!
      name: String!
      description: String
      createdAt: String!
      updatedAt: String!
      tasks: [Task!]!
    }

    type Task {
      id: ID!
      title: String!
      description: String
      status: String!
      priority: String!
      dueDate: String
      createdAt: String!
      updatedAt: String!
    }
  `,
  resolvers: {
    Mutation: {
      updateProject: async (
        _parent,
        args: {
          id: string;
          input: { name?: string | null; description?: string | null };
        },
        context,
      ) => {
        const input: { name?: string; description?: string | null } = {};

        if (
          args.input.name === undefined &&
          args.input.description === undefined
        ) {
          throw new GraphQLError("Provide a name or description to update.", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        if (args.input.name !== undefined) {
          const name = args.input.name?.trim();
          if (!name || name.length > 120) {
            throw new GraphQLError("Project name must be 1–120 characters.", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          input.name = name;
        }

        if (args.input.description !== undefined) {
          const description = args.input.description?.trim() || null;
          if (description && description.length > 500) {
            throw new GraphQLError(
              "Description must be at most 500 characters.",
              {
                extensions: { code: "BAD_USER_INPUT" },
              },
            );
          }
          input.description = description;
        }

        const project = await context.dataAccess.updateProjectForOwner(
          context.userId,
          args.id,
          input,
        );

        if (!project) {
          throw new GraphQLError("Project not found.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return project;
      },
      createProject: (
        _parent,
        args: { input: { name: string; description?: string | null } },
        context,
      ) => {
        const name = args.input.name.trim();
        const description = args.input.description?.trim() || null;

        if (!name || name.length > 120) {
          throw new GraphQLError("Project name must be 1–120 characters.", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        if (description && description.length > 500) {
          throw new GraphQLError(
            "Description must be at most 500 characters.",
            {
              extensions: { code: "BAD_USER_INPUT" },
            },
          );
        }

        return context.dataAccess.createProject(context.userId, {
          name,
          description,
        });
      },
      deleteProject: async (_parent, args: { id: string }, context) => {
        const deleted = await context.dataAccess.deleteProjectForOwner(
          context.userId,
          args.id,
        );

        if (!deleted) {
          throw new GraphQLError("Project not found.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return true;
      },
    },
    Query: {
      projects: (_parent, _args, context) =>
        context.dataAccess.getProjectsByOwnerId(context.userId),
      project: (_parent, args: { id: string }, context) =>
        context.dataAccess.getProjectByIdForOwner(context.userId, args.id),
    },

    Project: {
      tasks: (project: Project, _args, context) =>
        context.dataAccess.getTasksByProjectIdForOwner(
          context.userId,
          project.id,
        ),
    },
  },
});
