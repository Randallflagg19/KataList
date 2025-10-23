import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH - обновить кату (например, отметить как выполненную)
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const kata = await prisma.kata.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(kata);
  } catch {
    return NextResponse.json(
      { error: "Failed to update kata" },
      { status: 500 }
    );
  }
}

// DELETE - удалить кату
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.kata.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kata deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete kata" },
      { status: 500 }
    );
  }
}
