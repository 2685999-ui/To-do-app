import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // convert dueDate string into a real Date object before saving
  if (body.dueDate) {
    const parsed = new Date(body.dueDate);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json(
        { error: "Invalid due date" },
        { status: 400 }
      );
    }
    body.dueDate = parsed;
  }

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: body,
  });

  return NextResponse.json(task);
}