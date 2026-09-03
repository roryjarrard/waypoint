import "server-only";

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

export function createGraphQLContext(): GraphQLContext {
  const userId = process.env.WAYPOINT_DEV_USER_ID;

  if (!userId) {
    throw new Error("WAYPOINT_DEV_USER_ID is not defined");
  }

  return {
    userId,
    dataAccess: {
      getProjectsByOwnerId,
      getProjectByIdForOwner,
      getTasksByProjectIdForOwner,
    },
  };
}
