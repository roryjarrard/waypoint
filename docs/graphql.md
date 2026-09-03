# GraphQL Integration Standards

## Status

Implemented

## Decision

GraphQL will be introduced as a server-side API boundary over Waypoint's existing data-access layer. It will not own Prisma queries, persistence rules, or authorization logic.

The first implementation branch will be:

`feat/graphql-foundation`

## Server Library

Waypoint uses GraphQL Yoga with GraphQL.js.

GraphQL Yoga was selected because its Fetch API-based handler integrates directly with Next.js App Router Route Handlers. It also keeps the HTTP endpoint, schema, request context, and data-access dependencies separable and independently testable.

During this pre-authentication slice, the endpoint is restricted to local development so the temporary seed-user identity cannot expose user data through a public production API.

## First-Slice Scope

The branch will:

- Add the GraphQL server integration that fits the Next.js App Router.
- Define a small schema for reading projects and a single project with its tasks.
- Add an application-local GraphQL endpoint.
- Implement resolvers that call the shared server-only data-access layer.
- Use the deterministic development seed user as the request identity until authentication is implemented.
- Add focused tests for the schema/resolver boundary and ownership scoping.
- Document the local development and query workflow.

The branch will not:

- Add authentication or choose an authentication provider.
- Add GraphQL mutations.
- Add a generated client, normalized client cache, or Zustand.
- Move Prisma calls into resolvers.
- Expose a public production API.
- Generalize the schema beyond the current project and task workflows.

## Boundary

The request path is:

GraphQL endpoint → resolver → server-only data-access function → Prisma → PostgreSQL

Resolvers translate between the GraphQL schema and application operations. The data-access layer owns database access and user-ownership constraints so the same rules apply to GraphQL and native Next.js callers.

## Identity During This Slice

Until authentication is implemented, GraphQL requests use the deterministic seed user's internal UUID. The seed identity must be supplied by server-side application configuration and must never be accepted from an untrusted client argument or header.

After authentication is added, request context will resolve the external provider identity to the internal `User.id`; resolver and data-access interfaces should not need to change.

## Completion Criteria

This slice is complete when:

- A local GraphQL request can list the seed user's projects.
- A local GraphQL request can retrieve one owned project and its tasks.
- A project belonging to another user cannot be returned.
- Resolvers contain no direct Prisma queries.
- Existing native Next.js behavior remains functional.
- Lint, tests, and production build pass.

## Follow-up Slices

1. Authentication and request identity resolution
2. GraphQL mutations for the existing create/edit workflows
3. Client integration and code generation, if they provide a concrete benefit
4. Zustand only when shared client-side state presents a demonstrated need
