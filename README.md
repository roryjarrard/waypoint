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

There is no test setup yet.

## Project Status

Waypoint is in early, incremental development. The current focus is establishing the domain model and core project/task workflows before adding authentication, GraphQL, and client-side state management.
