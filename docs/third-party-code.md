# Third-Party Code

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

---
The preceding document was generated with the assistance of the following: Claude-Web[Claude Sonnet 5]
