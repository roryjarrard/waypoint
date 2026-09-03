import { createSchema } from "graphql-yoga";
import { GraphQLContext } from "./context";
import {
  getProjectByIdForOwner,
  getProjectsByOwnerId,
  getTasksByProjectIdForOwner,
} from "../data";
import type { Project } from "../types";

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Query {
      projects: [Project!]!
      project(id: ID!): Project
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
    Query: {
      projects: (_parent, _args, context) =>
        getProjectsByOwnerId(context.userId),
      project: (_parent, args: { id: string }, context) =>
        getProjectByIdForOwner(context.userId, args.id),
    },

    Project: {
      tasks: (project: Project, _args, context) =>
        getTasksByProjectIdForOwner(context.userId, project.id),
    },
  },
});
