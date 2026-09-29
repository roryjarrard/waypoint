import { createSchema } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "./context";
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

    type Mutation {
      createProject(input: CreateProjectInput!): Project!
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
