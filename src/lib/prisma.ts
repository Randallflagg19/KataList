import { PrismaClient as MainPrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// Если DATABASE_URL указывает на test.db, используем тестовый клиент
const isTestDb = process.env.DATABASE_URL?.includes("test.db");

let PrismaClient = MainPrismaClient;

if (isTestDb) {
  try {
    const TestClient = require("../../node_modules/.prisma/test-client");
    PrismaClient = TestClient.PrismaClient;
  } catch (e) {
    console.error("Failed to load test Prisma Client, using main client:", e);
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
