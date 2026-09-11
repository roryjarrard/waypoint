import "server-only";

import { GraphQLError } from "graphql";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getProjectByIdForOwner,
  getProjectsByOwnerId,
  getTasksByProjectIdForOwner,
} from "@/lib/data";

export type GraphQLDataAccess = {
  getProjectsByOwnerId: typeof getProjectsByOwnerId;
  getProjectByIdForOwner: typeof getProjectByIdForOwner;
  getTasksByProjectIdForOwner: typeof getTasksByProjectIdForOwner;
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
      getProjectsByOwnerId,
      getProjectByIdForOwner,
      getTasksByProjectIdForOwner,
    },
  };
}
