# Taskboard Specification

Written before implementation, following the spec-driven development approach.

## Goal

A simple web app where each user can register, log in, and manage a private list of tasks.

## Users

Anyone who wants a basic personal to-do list. Each user sees only their own tasks.

## Features

1. Register with email and password.
2. Log in and log out.
3. Create a task with a title and an optional due date.
4. View all of your tasks, newest first.
5. Filter tasks by status: All, To do, In progress, Done.
6. Change a task's status.
7. Edit a task's title and due date.
8. Delete a task, with a confirmation prompt.

## Data model

One table, `tasks`:

| Field      | Type        | Notes                                                |
|------------|-------------|------------------------------------------------------|
| id         | bigint      | Primary key, auto-generated                          |
| user_id    | uuid        | Owner, references the Supabase auth user             |
| title      | text        | Required, 1 to 200 characters                        |
| status     | text        | `todo`, `in_progress`, or `done`; defaults to `todo` |
| due_date   | date        | Optional                                             |
| created_at | timestamptz | Set automatically                                    |

## Rules

- Users must be logged in to see or change any data.
- A user can only read, create, update, or delete their own tasks.

## Acceptance criteria

- [ ] A new user can register and is taken to their task list.
- [ ] A logged-out user sees only the login screen.
- [ ] Adding a task saves it to Supabase and it appears in the list.
- [ ] Refreshing the page keeps the user logged in and shows the same tasks.
- [ ] Editing, status changes, and deletes are saved to the database.
- [ ] User A cannot see User B's tasks.
- [ ] Empty titles are rejected with a clear message.
- [ ] The deployed site on Vercel works the same as the local version.
