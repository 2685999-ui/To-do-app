import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tasks - fetch all tasks
export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

// POST /api/tasks - create a new task
export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, dueDate, topic } = body;

  if (!title || !dueDate || !topic) {
    return NextResponse.json(
      { error: "Title, due date and topic are required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: description ?? "",
      dueDate: new Date(dueDate),
      topic,
    },
  });

  return NextResponse.json(task, { status: 201 });
}