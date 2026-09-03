import { createYoga } from "graphql-yoga";

import { createGraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: createGraphQLContext,
  fetchAPI: { Response },
});

async function handleLocalRequest(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  return await handleRequest(request, {});
}

export {
  handleLocalRequest as GET,
  handleLocalRequest as POST,
  handleLocalRequest as OPTIONS,
};
