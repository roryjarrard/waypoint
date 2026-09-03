# Data Persistence Standards

## Status

Accepted

## Decision

Waypoint will use PostgreSQL with Prisma for persistent application data.

- Local development uses PostgreSQL running locally through Docker Compose.
- Staging and production use separate branches within one Neon project.
- The Neon `production` branch stores production data.
- The Neon `staging` branch contains only synthetic or test data.
- Vercel Preview deployments use the staging branch.
- Vercel Production deployments use the production branch.

Staging and production must use separate Neon branches, connection strings, and data.

## Configuration

Application code must read the database connection from the server-only `DATABASE_URL` environment variable. Code must not select a database URL by inspecting `NODE_ENV` or another runtime environment name.

| Environment | Configuration source | Database environment |
| --- | --- | --- |
| Local | `.env.local` | Local PostgreSQL |
| Staging | Vercel Preview environment | Neon `staging` branch |
| Production | Vercel Production environment | Neon `production` branch |

Requirements:

- Never prefix `DATABASE_URL` with `NEXT_PUBLIC_`.
- Never commit connection strings or credentials.
- Keep `.env.example` limited to documented placeholder values.
- Database access must remain in server-only modules.
- Mark shared database modules with `server-only` when appropriate to prevent accidental client imports.

### Neon Connections

Application runtime traffic uses each branch’s pooled Neon connection string. Prisma migration commands use the corresponding direct connection string.

Production and staging connection strings must never be shared across Vercel environments.

## Environment Isolation

- Local development must not connect to staging or production by default.
- Staging must contain only synthetic or test data.
- Production data must not be copied into local or staging environments.
- Automated tests must not run against staging or production.
- Destructive scripts must require an explicit database target and must refuse to run against production unless they were specifically designed and approved for that purpose.

## Schema and Migrations

The Prisma schema and generated migrations are part of the repository and must be committed.

Schema changes follow this sequence:

1. Create and test the migration against local PostgreSQL.
2. Review and commit the generated migration.
3. Apply the migration to staging.
4. Verify the application using the Vercel Preview deployment.
5. Apply the same migration to production.

Do not use direct schema synchronization against staging or production as a substitute for committed migrations. Never edit a migration after it has been applied to a shared environment; create a new migration instead.

## Initial Ownership Model

- A user owns many projects.
- A project belongs to exactly one user through `ownerId`.
- A project contains many tasks.
- A task belongs to exactly one project through `projectId`.
- Task ownership is derived through its project and should not be duplicated by default.

All reads and mutations involving user data must enforce ownership on the server. Filtering records in the UI is not authorization.

## Data Access Boundaries

- React Client Components must not query PostgreSQL or import Prisma directly.
- Server Components, Server Actions, route handlers, and future GraphQL resolvers may call a shared server-only data-access layer.
- UI components should not contain raw database queries.
- Authorization belongs at or below the server-side data-access boundary so every caller receives the same protection.
- GraphQL will later become another consumer of the data-access layer, not the owner of persistence logic.

## Development Approach

The database should be introduced before authentication so the project and task workflows can be built against real persistence. Until authentication is implemented, development records may use a clearly identified seed user. This temporary approach must not weaken the eventual ownership model or be used in production.

Seed data should be deterministic, safe to recreate, and contain no real personal information.

## Deferred Decisions

The following choices will be made when their implementation becomes necessary:

- Authentication provider
- Production migration automation
- Ephemeral Neon branches for isolated pull-request Preview deployments
- Backup and retention policy beyond Neon defaults
- Connection-pooling configuration based on the selected Prisma and Neon integration
