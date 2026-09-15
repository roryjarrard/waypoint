# Authentication

## Purpose

This document records the authentication and identity decisions for Waypoint. It describes how users prove their identity, how that identity maps to Waypoint's application data, and where authorization is enforced.

Implementation details may evolve, but changes should preserve the core separation between external authentication and Waypoint's internal domain identity.

## Status

Firebase Authentication has been selected as Waypoint's external identity provider.

The initial authentication slice will support email-and-password registration, sign-in, and sign-out. Google sign-in is enabled in Firebase but is deferred until the initial flow is complete.

## Goals

- Allow a user to register, sign in, and sign out.
- Restrict projects and tasks to their owner.
- Validate authentication on the server before rendering protected content or executing protected GraphQL operations.
- Keep Waypoint's domain model independent of a specific authentication provider.
- Use separate authentication environments for staging and production.

## Non-goals for the Initial Slice

- Google sign-in or other federated providers
- Multi-factor authentication
- Roles or administrative permissions
- Organization or team accounts
- Anonymous authentication
- Account linking across multiple sign-in providers
- Custom password storage or credential validation

## Provider Decision

Waypoint uses Firebase Authentication to manage credentials and authenticate users.

Firebase is responsible for:

- Creating and maintaining authentication accounts
- Storing and validating email-and-password credentials
- Issuing identity tokens
- Supporting password-reset and email-verification capabilities
- Supporting Google and other federated sign-in methods when added

Waypoint does not store passwords or implement password hashing.

## Environment Strategy

Staging and production use separate Firebase projects. This keeps authentication accounts, provider configuration, and credentials isolated between environments.

| Waypoint environment | Firebase project | Database |
| --- | --- | --- |
| Local development and staging | `waypoint-staging` | Neon staging or the local development database, as configured |
| Production | `waypoint-production` | Neon production |

Local development initially uses the staging Firebase project. The Firebase Authentication Emulator may be introduced later if isolated or automated authentication testing requires it.

## Identity Model

Waypoint distinguishes between authentication identity and application identity.

- Firebase identifies an authenticated account using its stable `uid`.
- Waypoint stores that value in `User.authProviderId`.
- Waypoint continues to identify users internally using `User.id`, an application-generated UUID.
- Projects and other domain records reference the internal `User.id`, never the Firebase `uid`.

```text
Firebase uid
    -> User.authProviderId
    -> User.id
    -> Project.ownerId
    -> Task.projectId
```

This design prevents Firebase identifiers from becoming domain foreign keys and leaves room to replace or supplement the authentication provider later.

The development seed user may continue to have a null `authProviderId`; it is not treated as an authenticated Firebase account.

## User Provisioning

After Firebase authenticates an account, Waypoint resolves the Firebase `uid` to an internal `User` record.

For a new account, Waypoint creates a `User` with:

- A new internal UUID in `User.id`
- The Firebase `uid` in `User.authProviderId`
- The authenticated email address in `User.email`
- The available display name in `User.name`, when provided

For an existing account, Waypoint loads the user by `authProviderId` and uses the corresponding internal `User.id` throughout the request.

Provisioning must be safe to repeat so concurrent or retried requests cannot create duplicate users. The unique constraints on `authProviderId` and `email` provide database-level protection, while the application must handle uniqueness conflicts deliberately.

## Session Strategy

Waypoint uses server-managed Firebase session cookies for authenticated browser sessions.

The intended flow is:

1. The browser authenticates with Firebase and receives a Firebase ID token.
2. The browser sends that ID token to a Waypoint session endpoint.
3. The server verifies the ID token with the Firebase Admin SDK.
4. The server creates a Firebase session cookie.
5. Waypoint sends the cookie as secure, HTTP-only, and same-site.
6. Subsequent server requests validate the session cookie before trusting the user's identity.

The Firebase ID token is not used as Waypoint's long-lived browser session, and authentication state is not trusted solely because client-side Firebase state reports a signed-in user.

On sign-out, Waypoint clears the session cookie. Server-side revocation may be added where required by the final logout and security design.

## Server-side Enforcement

Route redirects improve the user experience, but they are not the authorization boundary.

Waypoint must validate the Firebase session on the server for:

- Protected Server Components and pages
- Route Handlers that expose authenticated behavior
- The GraphQL endpoint and its request context
- Every query or mutation that accesses user-owned data

The GraphQL context resolves the authenticated Firebase `uid` to Waypoint's internal `User.id`. Resolvers receive the internal ID and scope database operations to it.

Resolvers must continue enforcing ownership even when a page has already performed an authentication check. A user being authenticated does not imply access to an arbitrary project or task.

## Route Behavior

### Public-only routes

- `/login`
- `/register`

Unauthenticated users may access these routes. Authenticated users are redirected to the dashboard.

### Protected routes

- `/dashboard`
- Project routes
- Other routes that display or modify user-owned data

Unauthenticated users are redirected to `/login`. When practical, the original destination is preserved so the user can return after successful sign-in.

## Initial Sign-in Methods

### Email and password

Email-and-password authentication is part of the initial slice and includes:

- Account registration
- Sign-in
- Sign-out
- Appropriate handling of authentication errors

Email verification and password-reset behavior will be decided during implementation rather than assumed as requirements for the first working slice.

### Google

Google sign-in is enabled in the staging Firebase project but deferred. It should reuse the same session-cookie, user-provisioning, internal-identity, and authorization flow as email-and-password authentication.

## Configuration and Secrets

The Firebase browser configuration is supplied through environment variables. These values identify the Firebase web application but do not grant Firebase Admin privileges.

Firebase Admin credentials are server-only secrets. They must never be:

- Exposed through `NEXT_PUBLIC_` environment variables
- Imported into client components
- Included in browser bundles
- Committed to the repository

Local, staging, and production configuration must select the appropriate Firebase project and corresponding database environment.

## Security Principles

- Authentication checks run on the server for protected resources.
- Authorization is enforced at the data-access boundary.
- Session cookies are HTTP-only and secure in deployed environments.
- Redirects and client-side guards are treated as user-experience features, not security controls.
- Firebase Admin code remains server-only.
- Error responses must not expose credentials, tokens, or unnecessary account details.
- Application data continues to use internal UUIDs rather than provider identifiers.

## Testing Expectations

The authentication slice should test at least:

- Unauthenticated access to protected pages
- Redirect behavior and return-path preservation
- Successful session creation after Firebase authentication
- Rejection of invalid or expired authentication tokens
- Session-cookie validation
- Resolution of Firebase `uid` to internal `User.id`
- New-user provisioning and repeat provisioning
- GraphQL rejection when no valid session exists
- Ownership enforcement between two different users
- Sign-out and cookie removal

## Deferred Decisions

- When email verification becomes mandatory
- Password-reset user experience
- Google sign-in implementation
- Firebase Authentication Emulator adoption
- Explicit server-side session revocation policy
- Account deletion and corresponding domain-data behavior
- Linking multiple Firebase providers to one Waypoint user
- Roles, teams, or organization-level authorization
