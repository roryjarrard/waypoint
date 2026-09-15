import { createYoga } from "graphql-yoga";

import { createGraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: createGraphQLContext,
  fetchAPI: { Response },
});

async function handleGetRequest(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  return handleRequest(request, {});
}

async function handleGraphQLRequest(request: Request): Promise<Response> {
  return handleRequest(request, {});
}

export {
  handleGetRequest as GET,
  handleGraphQLRequest as POST,
  handleGraphQLRequest as OPTIONS,
};
