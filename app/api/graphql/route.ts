import { createGraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";
import { createYoga } from "graphql-yoga";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: createGraphQLContext,
});

export { yoga as GET, yoga as POST, yoga as OPTIONS };
