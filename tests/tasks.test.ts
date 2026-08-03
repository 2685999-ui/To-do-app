import { describe, it, expect, beforeEach } from "vitest";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

describe("Task behavior", () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  it("creates a task and it appears in the database", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Finish lab",
        description: "COMS3011A lab 1",
        dueDate: new Date("2026-08-04"),
        topic: "COMS3011A",
      },
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Finish lab");
    expect(task.status).toBe("Todo"); 
    expect(task.archived).toBe(false); 

    const found = await prisma.task.findUnique({ where: { id: task.id } });
    expect(found).not.toBeNull();
  });

  it("archives a task instead of deleting it, and it remains viewable", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Old task",
        description: "should be archived not deleted",
        dueDate: new Date("2026-01-01"),
        topic: "Personal",
      },
    });

    await prisma.task.update({
      where: { id: task.id },
      data: { archived: true },
    });

    const found = await prisma.task.findUnique({ where: { id: task.id } });

    expect(found).not.toBeNull();
    expect(found?.archived).toBe(true);
  });

  it("flags a task as overdue when the due date has passed and it isn't complete", async () => {
    const overdueTask = await prisma.task.create({
      data: {
        title: "Late task",
        description: "due date in the past",
        dueDate: new Date("2020-01-01"), 
        topic: "Test",
        status: "Todo",
      },
    });

    const completedTask = await prisma.task.create({
      data: {
        title: "Late but done",
        description: "due date in the past but completed",
        dueDate: new Date("2020-01-01"),
        topic: "Test",
        status: "Complete",
      },
    });

    function isOverdue(task: { dueDate: Date; status: string }) {
      return task.dueDate < new Date() && task.status !== "Complete";
    }

    expect(isOverdue(overdueTask)).toBe(true);
    expect(isOverdue(completedTask)).toBe(false); 
  });
});