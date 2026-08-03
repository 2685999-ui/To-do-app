import { config } from "dotenv";
import { execSync } from "child_process";
import { beforeAll, afterAll } from "vitest";
import fs from "fs";

config({ path: ".env.test" });

const testDbPath = "./prisma/test.db";

beforeAll(() => {
  execSync("npx prisma db push --accept-data-loss", {
    env: { ...process.env, DATABASE_URL: "file:./prisma/test.db" },
    stdio: "inherit",
  });
});

afterAll(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

