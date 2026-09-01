# CLAUDE.md

Keep replies extremely concise and focused on the key information. Avoid unnecessary commentary and long code snippets unless they are needed to explain or complete the task.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Before Writing Code

Before generating or editing code, always check the `/docs` directory for standards relevant to the task and follow them exactly.

- Read only the documents relevant to the current task.
- Treat the documents in `/docs` as repository-specific requirements.
- If the requested work conflicts with an existing standard, call out the conflict before proceeding.
- When a significant design decision is made, suggest documenting it rather than silently establishing a new convention.

Standards documents may be added as the project evolves. Examples include:

- `docs/ui.md`
- `docs/data-fetching.md`
- `docs/data-mutations.md`
- `docs/auth.md`

## Project Intent

Waypoint is both a portfolio project and a deliberate learning project. Build it incrementally so architectural choices remain understandable and defensible.

- Do not add new libraries, abstractions, or architectural layers before they are needed.
- Explain meaningful tradeoffs briefly before making a consequential design choice.
- Prefer small, reviewable changes over broad rewrites.
- Preserve the distinction between code written for the current phase and features planned for later phases.
- Do not introduce GraphQL or Zustand until explicitly requested. The initial application should use native Next.js and React patterns.
- When GraphQL is introduced, use it for server data. When Zustand is introduced, use it for client-side application or UI state rather than duplicating server data by default.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config via `eslint.config.mjs`)

There is no test setup in this project yet.

## Architecture

Waypoint is a Next.js App Router project (Next.js 16.3.4, React 19) currently at the freshly-scaffolded `create-next-app` state. `app/page.tsx` is the only route, `app/layout.tsx` defines the root layout, and `app/globals.css` holds Tailwind v4 styles (loaded via `@tailwindcss/postcss`, with no `tailwind.config.*` file).

Path alias `@/*` maps to the repo root (`tsconfig.json`).

**Important:** Next.js 16 has breaking changes relative to older training data. Before writing framework-related code (routing, data fetching, config, etc.), consult `node_modules/next/dist/docs/` (see `AGENTS.md`) rather than relying on prior knowledge of Next.js.
