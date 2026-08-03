# Running It

**Requires:** Node.js v24.18.1 (or any recent LTS version).

From a clean clone:

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Generate the Prisma client
npx prisma generate

# 3. Create the database and apply the schema
npx prisma migrate dev --name init

# 4. Start the application
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`.

## Running tests

\`\`\`bash
npm test
\`\`\`

Tests run against a separate, throwaway SQLite database (`prisma/test.db`), which is created fresh and deleted automatically after each test run. Your real data in `prisma/dev.db` is never touched by the tests.

---
The preceding document was generated with the assistance of the following: Claude-Web[Claude Sonnet 5]
