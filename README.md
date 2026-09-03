# Waypoint

Waypoint is a focused project and task management application for individuals. It's also a portfolio and learning project, built incrementally so that each architectural decision stays understandable and defensible.

See [`docs/product.md`](docs/product.md) for full product scope and [`docs/data-persistence.md`](docs/data-persistence.md) for persistence architecture. Additional standards will be added to `docs/` as the project evolves — check there before making changes.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) with React 19
- PostgreSQL + Prisma (local via Docker Compose, Neon for staging/production)
- Tailwind CSS v4
- Deployed on Vercel

GraphQL and Zustand are intentionally deferred until they're needed — see `docs/product.md` for the planned sequence.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — run ESLint
- `npm test` - run the GraphQL boundary tests

## Local GraphQL Development

The GraphQL endpoint is available only during local development:

```text
http://localhost:3000/api/graphql
```

Set the deterministic development-user ID in `.env.local`:

```env
WAYPOINT_DEV_USER_ID=00000000-0000-4000-8000-000000000001
```

Seed the local database with the same identity:

```bash
WAYPOINT_DEV_USER_ID=00000000-0000-4000-8000-000000000001 npm exec prisma db seed
```

Then start the application:

```bash
npm run dev
```

Opening the endpoint in a browser displays GraphiQL.

List the development user’s projects:

```graphql
query Projects {
  projects {
    id
    name
    description
  }
}
```

Retrieve one owned project with its tasks:

```graphql
query Project($id: ID!) {
  project(id: $id) {
    id
    name
    description
    tasks {
      id
      title
      status
      priority
      dueDate
    }
  }
}
```

Use variables such as:

```json
{
  "id": "00000000-0000-4000-8000-000000000101"
}
```

Request identity comes from server-side configuration. It is not accepted from GraphQL arguments or request headers. Until authentication is implemented, the GraphQL endpoint returns `404` outside local development.

## Project Status

Waypoint has established its initial project and task domain, PostgreSQL persistence through Prisma, and a read-only GraphQL foundation.

The GraphQL API currently supports listing the development user’s projects and retrieving one owned project with its tasks. Request identity temporarily comes from server-side development configuration, and the endpoint is restricted to local development.

The next architectural slice is authentication, including resolving an external provider identity to Waypoint’s internal user UUID. GraphQL mutations, client integration, code generation, and Zustand remain deferred.
