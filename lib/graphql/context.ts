import "server-only";

import { GraphQLError } from "graphql";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  createProject,
  updateProjectForOwner,
  getProjectByIdForOwner,
  getProjectsByOwnerId,
  getTasksByProjectIdForOwner,
  deleteProjectForOwner,
} from "@/lib/data";

export type GraphQLDataAccess = {
  createProject: typeof createProject;
  updateProjectForOwner: typeof updateProjectForOwner;
  getProjectsByOwnerId: typeof getProjectsByOwnerId;
  getProjectByIdForOwner: typeof getProjectByIdForOwner;
  getTasksByProjectIdForOwner: typeof getTasksByProjectIdForOwner;
  deleteProjectForOwner: typeof deleteProjectForOwner;
};

export type GraphQLContext = {
  userId: string;
  dataAccess: GraphQLDataAccess;
};

export async function createGraphQLContext(): Promise<GraphQLContext> {
  const user = await getCurrentUser();

  if (!user) {
    throw new GraphQLError("Authentication is required.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  return {
    userId: user.id,
    dataAccess: {
      createProject,
      updateProjectForOwner,
      getProjectsByOwnerId,
      getProjectByIdForOwner,
      getTasksByProjectIdForOwner,
      deleteProjectForOwner,
    },
  };
}
