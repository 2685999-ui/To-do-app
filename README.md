# Todo App

A local-first todo application built with Next.js, Prisma, and SQLite. Runs entirely on your machine — no accounts, no deployment, no external services.

## Third-Party Code

| Package | Why it was chosen |
|---|---|
| `next` | Framework providing both the frontend (React pages) and backend (API routes) in a single project, avoiding the need for a separate server. |
| `react` / `react-dom` | Required by Next.js to render the UI. |
| `prisma` | Type-safe ORM that generates a client from a schema file, avoiding hand-written SQL and giving migration tooling. |
| `@prisma/client` | The generated database client used at runtime to query SQLite. |
| `@prisma/adapter-better-sqlite3` | Driver adapter required by Prisma 7 to connect to a local SQLite file. |
| `better-sqlite3` | Fast, synchronous SQLite driver used under the Prisma adapter. |
| `tailwindcss` | Utility-first CSS used for styling the UI without writing a separate stylesheet per component. |
| `vitest` | Test runner used to write and execute the automated tests, chosen for its speed and native TypeScript support. |
| `dotenv` | Loads environment variables (the database connection string) from `.env` files. |

## Database Design

The application uses a single SQLite database with one table, `Task`:

| Column | Type | Notes |
|---|---|---|
| `id` | Int (autoincrement) | Primary key |
| `title` | String | Required |
| `description` | String | |
| `dueDate` | DateTime | Required |
| `topic` | String | Required |
| `status` | String | One of `"Todo"`, `"In-Progress"`, `"Complete"`; defaults to `"Todo"` |
| `archived` | Boolean | Defaults to `false`. Archiving a task sets this flag rather than deleting the row, so archived tasks remain viewable. |
| `createdAt` | DateTime | Set automatically on creation |

**Design decisions:**
- A single table is used because Topic and Status are simple attributes of a task, not independent entities with their own behaviour or relationships.
- Archiving is implemented as a boolean flag on the task itself (not a separate table or row deletion), so an archived task's full history and data remain intact and queryable.
- "Overdue" is **not** stored as a column or status. It is calculated at read time by comparing `dueDate` against the current date, and only applies when `status` is not `"Complete"`. This keeps the overdue state always accurate, even if the app is closed for a long time before being reopened.

## Running It

**Requires:** Node.js v24.18.1 (or any recent LTS version).

From a clean clone:

```bash
# 1. Install dependencies
npm install

# 2. Generate the Prisma client
npx prisma generate

# 3. Create the database and apply the schema
npx prisma migrate dev --name init

# 4. Start the application
npm run dev
```

The app will be available at `http://localhost:3000`.

**Running tests:**

```bash


## AI Usage

This repository makes use of AI code generation using the following tools: Claude-Web[Claude Sonnet 5].
This repository does not use AI in-line editing tools.
This repository does not use AI code review.
npm test
```

Tests run against a separate, throwaway SQLite database (`prisma/test.db`), which is created fresh and deleted automatically after each test run. Your real data in `prisma/dev.db` is never touched by the tests.
