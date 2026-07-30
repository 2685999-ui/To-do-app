import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/tasks/:id - update status, archive, or edit a task
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: body,
  });

  return NextResponse.json(task);
}