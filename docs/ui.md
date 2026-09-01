# UI Standards

## Purpose

Waypoint should feel like a focused, trustworthy project-management product rather than a tutorial or generic admin template. The interface should be restrained, readable, responsive, and accessible.

These standards apply to all user-facing UI. Update this document when a repeated pattern or meaningful design decision is established.

## Design Direction

- Use a clean, modern SaaS aesthetic with strong information hierarchy.
- Prefer generous whitespace and clear grouping over dense dashboards.
- Use neutral surfaces with one restrained accent color for primary actions, links, and focus states.
- Avoid decorative gradients, excessive shadows, glass effects, and animation without a functional purpose.
- Keep visual treatments consistent across projects, tasks, forms, and status indicators.
- Do not add a component library or icon library without an explicit decision.

## Layout

- Use a centered content container with a consistent maximum width and responsive horizontal padding.
- Use semantic page regions such as `header`, `nav`, `main`, and `section`.
- Keep primary page headings and actions visually distinct from page content.
- Use CSS Grid for collections of equal items and Flexbox for one-dimensional alignment.
- Design mobile layouts first, then enhance them at wider breakpoints.
- Avoid fixed widths that cause horizontal scrolling on small screens.

For the initial project list:

- Use `app/dashboard/page.tsx` as the dashboard and project list.
- Present a clear page heading and short supporting description.
- Display projects in a responsive card grid.
- Each card should show the project name, description, completed task count, and total task count.
- Make the project name or a clearly labeled action the link to its detail page.
- Do not display controls that are not yet functional.

## Route Structure

Waypoint separates its public entry points from the authenticated application.

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Public product introduction | Public |
| `/login` | Sign in | Public only |
| `/register` | Create an account | Public only |
| `/dashboard` | Project list and authenticated home | Protected |
| `/projects/[projectId]` | Project details and tasks | Protected |

Requirements after authentication is implemented:

- Unauthenticated access to a protected route redirects to `/login`.
- Preserve the originally requested route so a successful sign-in can return the user to it.
- Authenticated access to `/login` or `/register` redirects to `/dashboard`.
- Do not embed login or registration forms inside the dashboard or project views.
- The public landing page must remain useful without requiring an account.
- Authentication and authorization checks must occur on the server; hiding protected UI is not access control.

Before authentication is implemented, `/dashboard` may render mock data without protection. Treat this as a temporary development state and do not create placeholder authentication behavior.

### Public Landing Page

- Keep the initial landing page concise: product name, purpose, and a clear path into the currently available experience.
- Do not build an elaborate marketing site during the core application phase.
- Add sign-in and registration calls to action only when those destinations function.
- The landing page may later include a product preview, live-demo link, and repository link when they are useful to portfolio visitors.

## Typography

- Use the font configured by the Next.js root layout; do not add another font without a clear need.
- Use one `h1` per page and preserve a logical heading hierarchy.
- Prefer concise headings and plain-language labels.
- Keep body text comfortably readable and avoid very light font weights or low-contrast secondary text.
- Use monospaced text only for code, identifiers, or technical values.

## Color and Status

- Define reusable colors through the existing Tailwind theme or CSS custom properties rather than repeating arbitrary values.
- Ensure text and interactive controls meet WCAG AA contrast requirements.
- Preserve the scaffold's system light/dark color-scheme support throughout development.
- Whenever an explicit foreground, background, border, or interaction color is added, verify it in both light and dark modes and include an appropriate `dark:` treatment when necessary.
- Do not assume that a light-mode color remains readable against the dark-mode background.
- Do not communicate status or priority through color alone; always include visible text.
- Use the same visual treatment for a given task status or priority everywhere it appears.
- Reserve destructive colors for destructive actions and error states.

Specific brand colors, a custom dark palette, persisted theme preferences, and a manual theme switcher are deferred until the core interface establishes a clear need. Basic compatibility with the user's system color scheme is required now.

## Components

- Keep components small enough to have a clear responsibility, but do not extract components solely to shorten a file.
- Extract a component when it is reused, has its own behavior, or represents a meaningful UI concept.
- Place shared application components in `components/`.
- Keep route-specific components near their route when they are unlikely to be reused.
- Use descriptive names such as `ProjectCard`, `TaskStatusBadge`, and `EmptyState`.
- Accept data through typed props; components should not reach into mock data or the database unless they are explicitly data-owning server components.
- Prefer composition over large sets of boolean styling props.

## Server and Client Components

- Use Server Components by default.
- Add `"use client"` only when a component requires browser APIs, event handlers, or client-side state.
- Keep client boundaries as narrow as practical.
- Do not make an entire page a Client Component to support one interactive child.
- Use `next/link` for internal navigation.
- Use `next/image` for application images when its optimization and sizing behavior are appropriate.

## Interaction

- Use native interactive elements: `button` for actions and links for navigation.
- Every interactive element must have an accessible name and a visible keyboard focus state.
- Hover styles must supplement, not replace, keyboard focus styles.
- Keep tap targets large enough for comfortable touch use.
- Avoid clickable containers when a clearly defined link or button is more appropriate.
- Never render an enabled-looking control that has no behavior.
- Motion should be subtle and must respect `prefers-reduced-motion` when nonessential animation is introduced.

## Forms

- Every input must have an associated visible label.
- Mark required fields clearly in text, not only with color or an asterisk without explanation.
- Place validation messages near the relevant field and connect them programmatically.
- Preserve entered values when validation fails.
- Disable submission only when necessary and provide clear pending and success feedback.
- Do not use placeholder text as the only label or instruction.

## Application States

Every data-driven view should deliberately handle:

- Loading
- Empty
- Error
- Success

Empty states should explain what is missing and offer a next step only when that action exists. Errors should be understandable and should not expose internal implementation details.

## Accessibility

- Target WCAG 2.2 AA.
- Use semantic HTML before adding ARIA.
- Ensure all functionality is available by keyboard.
- Preserve logical DOM and focus order across responsive layouts.
- Provide visible focus indicators.
- Give icon-only controls accessible names; prefer visible text when space allows.
- Associate validation, status, and error messages with the controls or regions they describe.
- Test pages at keyboard-only navigation and narrow mobile widths during implementation.

## Tailwind CSS

- Use Tailwind utility classes for component and layout styling.
- Follow the Tailwind v4 setup already present in the repository; do not introduce a legacy configuration pattern.
- Extract a component instead of creating long repeated class lists.
- Avoid premature abstraction of one-off class combinations.
- Keep responsive and state variants near the base styles they modify.

## Scope Discipline

- Build only the UI required for the current product phase.
- Do not add speculative navigation, settings, profile controls, notifications, or collaboration features.
- Do not introduce global client state for UI that can be expressed through server data, route state, or local component state.
- Favor a complete, polished small workflow over several incomplete screens.
