# Database Design

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

## Design decisions

- A single table is used because Topic and Status are simple attributes of a task, not independent entities with their own behaviour or relationships.
- Archiving is implemented as a boolean flag on the task itself (not a separate table or row deletion), so an archived task's full history and data remain intact and queryable.
- "Overdue" is **not** stored as a column or status. It is calculated at read time by comparing `dueDate` against the current date, and only applies when `status` is not `"Complete"`. This keeps the overdue state always accurate, even if the app is closed for a long time before being reopened.

---
The preceding document was generated with the assistance of the following: Claude-Web[Claude Sonnet 5]
