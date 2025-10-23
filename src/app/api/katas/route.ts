import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - получить все каты
export async function GET() {
  try {
    const katas = await prisma.kata.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(katas);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch katas" },
      { status: 500 }
    );
  }
}

// POST - создать новую кату
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, difficulty, notes } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const kata = await prisma.kata.create({
      data: {
        title,
        url,
        difficulty,
        notes,
      },
    });

    return NextResponse.json(kata, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create kata" },
      { status: 500 }
    );
  }
}
