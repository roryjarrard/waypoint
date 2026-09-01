# Waypoint Product Definition

## Overview

Waypoint is a focused project and task management application for individuals. It helps a user organize projects, break work into tasks, and quickly understand what needs attention.

The application is also a portfolio and learning project. It should demonstrate thoughtful product decisions, incremental development, and modern full-stack engineering without adding complexity before it is useful.

## Target User

Waypoint is designed for individuals managing personal or professional projects. Each person has an account and a private workspace containing only their projects and tasks. Team collaboration is outside the first release.

## Product Goals

- Make projects and their current state easy to understand.
- Make creating and updating tasks fast and predictable.
- Keep each user's projects and tasks private and associated with their account.
- Provide enough organization to be useful without becoming a heavyweight project-management tool.
- Establish a clear domain that can later support GraphQL and client-side state management.

## MVP Scope

### Accounts

A user can:

- Create an account or sign in through the selected authentication provider.
- Sign out.
- Access only projects and tasks associated with their account.

Authentication is part of the intended MVP, but it will be implemented after the initial project and task workflows are established.

### Projects

A user can:

- View all projects.
- Create a project.
- View a project's details and tasks.
- Edit a project's name and description.

### Tasks

A user can:

- Create a task within a project.
- View a task's details.
- Edit a task.
- Change a task's status.
- Assign a priority and optional due date.
- Filter a project's tasks by status.

## Initial Domain Model

### User

- `id`
- `name`
- `email`
- `createdAt`
- `updatedAt`

### Project

- `id`
- `ownerId`
- `name`
- `description`
- `createdAt`
- `updatedAt`

### Task

- `id`
- `projectId`
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `createdAt`
- `updatedAt`

### Task Status

- `todo`
- `in-progress`
- `done`

### Task Priority

- `low`
- `medium`
- `high`

## Primary Views

### Project List

Displays all projects and provides a clear path to create or open a project.

### Project Detail

Displays project information and its tasks. Tasks can be filtered by status, and the user can create or update a task from this area.

### Task Detail

Displays the complete task and allows its fields to be edited.

## Out of Scope for the MVP

- Teams, invitations, and task assignments
- Comments and activity history
- Attachments
- Notifications
- Real-time collaboration
- GraphQL
- Zustand or another global client-state library
- Advanced workflows such as custom statuses, dependencies, or time tracking

These features may be considered later, but the initial architecture should not be complicated solely to anticipate them.

## Product Principles

- Prefer clarity over feature density.
- Keep common actions close to the information they affect.
- Provide clear loading, empty, error, and success states.
- Make accessibility and responsive behavior part of the implementation rather than later polish.
- Introduce dependencies and abstractions only when the current product requires them.

## Initial Development Sequence

1. Define the domain with TypeScript types and realistic mock data.
2. Build the project list view.
3. Build the project detail and task views.
4. Add create and edit interactions.
5. Choose and add persistence.
6. Add authentication and enforce ownership of projects and tasks.
7. Introduce GraphQL after the native Next.js data flow is understood.
8. Introduce Zustand when shared client-side state presents a concrete need.

## MVP Completion Criteria

The MVP is complete when a user can sign in, create and manage private projects and tasks, filter tasks by status, refresh the application without losing data, and use the core workflow on both desktop and mobile layouts. Users must not be able to access another user's data.
