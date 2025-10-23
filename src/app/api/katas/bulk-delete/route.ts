import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - удалить несколько кат по ID
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Проверяем что все ID являются строками
    if (!ids.every((id: any) => typeof id === "string")) {
      return NextResponse.json(
        { error: "All IDs must be strings" },
        { status: 400 }
      );
    }

    // Удаляем каты
    const result = await prisma.kata.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      message: `${result.count} katas deleted successfully`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete katas" },
      { status: 500 }
    );
  }
}
