import "server-only";

export type GraphQLContext = {
  userId: string;
};

export function createGraphQLContext(): GraphQLContext {
  const userId = process.env.WAYPOINT_DEV_USER_ID;

  if (!userId) {
    throw new Error("WAYPOINT_DEV_USER_ID is not defined");
  }

  return { userId };
}
