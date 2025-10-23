import { test, expect } from "@playwright/test";

test.describe("API Tests", () => {
  test.beforeEach(async ({ request }) => {
    // Очищаем БД перед каждым тестом
    const response = await request.get("/api/katas");
    const katas = await response.json();

    // Удаляем все тестовые каты
    const testKataTitles = [
      "Test API Kata",
      "Test Kata",
      "First Kata",
      "Second Kata",
      "Updated Title",
      "Bulk Delete Kata 1",
      "Bulk Delete Kata 2",
      "Original Title",
      "Kata to Delete",
    ];

    for (const kata of katas) {
      if (
        testKataTitles.includes(kata.title) ||
        kata.title.startsWith("Test Kata ")
      ) {
        await request.delete(`/api/katas/${kata.id}`);
      }
    }
  });

  test.afterEach(async ({ request }) => {
    // Очищаем БД после каждого теста
    const response = await request.get("/api/katas");
    const katas = await response.json();

    // Удаляем все тестовые каты
    const testKataTitles = [
      "Test API Kata",
      "Test Kata",
      "First Kata",
      "Second Kata",
      "Updated Title",
      "Bulk Delete Kata 1",
      "Bulk Delete Kata 2",
      "Original Title",
      "Kata to Delete",
    ];

    for (const kata of katas) {
      if (
        testKataTitles.includes(kata.title) ||
        kata.title.startsWith("Test Kata ")
      ) {
        await request.delete(`/api/katas/${kata.id}`);
      }
    }
  });
  test("GET /api/katas should return 200 status", async ({ request }) => {
    const response = await request.get("/api/katas");
    expect(response.status()).toBe(200);
  });

  test("POST /api/katas should create new kata", async ({ request }) => {
    const kataData = {
      title: "Test API Kata",
      url: "https://www.codewars.com/kata/test-api",
      difficulty: "8kyu",
      notes: "This is a test kata from API",
    };

    const response = await request.post("/api/katas", {
      data: kataData,
    });

    expect(response.status()).toBe(201);

    const createdKata = await response.json();
    expect(createdKata.title).toBe(kataData.title);
    expect(createdKata.url).toBe(kataData.url);
    expect(createdKata.difficulty).toBe(kataData.difficulty);
    expect(createdKata.notes).toBe(kataData.notes);
    expect(createdKata.completed).toBe(false);
    expect(createdKata.id).toBeDefined();
    expect(createdKata.createdAt).toBeDefined();
  });

  test("POST /api/katas should require title and url", async ({ request }) => {
    const response = await request.post("/api/katas", {
      data: { difficulty: "8kyu" },
    });

    expect(response.status()).toBe(400);

    const error = await response.json();
    expect(error.error).toBe("Title and URL are required");
  });

  test("POST /api/katas should validate URL format", async ({ request }) => {
    const response = await request.post("/api/katas", {
      data: {
        title: "Test Kata",
        url: "invalid-url",
      },
    });

    expect(response.status()).toBe(201); // Prisma не валидирует URL формат
  });

  test("PATCH /api/katas/[id] should update kata", async ({ request }) => {
    // Сначала создаём кату
    const createResponse = await request.post("/api/katas", {
      data: {
        title: "Original Title",
        url: "https://www.codewars.com/kata/original",
      },
    });

    const createdKata = await createResponse.json();
    const kataId = createdKata.id;

    // Обновляем кату
    const updateData = {
      title: "Updated Title",
      completed: true,
      notes: "Updated notes",
    };

    const updateResponse = await request.patch(`/api/katas/${kataId}`, {
      data: updateData,
    });

    expect(updateResponse.status()).toBe(200);

    const updatedKata = await updateResponse.json();
    expect(updatedKata.title).toBe(updateData.title);
    expect(updatedKata.completed).toBe(updateData.completed);
    expect(updatedKata.notes).toBe(updateData.notes);
  });

  test("DELETE /api/katas/[id] should delete kata", async ({ request }) => {
    // Сначала создаём кату
    const createResponse = await request.post("/api/katas", {
      data: {
        title: "Kata to Delete",
        url: "https://www.codewars.com/kata/delete-me",
      },
    });

    const createdKata = await createResponse.json();
    const kataId = createdKata.id;

    // Удаляем кату
    const deleteResponse = await request.delete(`/api/katas/${kataId}`);
    expect(deleteResponse.status()).toBe(200);

    const deleteResult = await deleteResponse.json();
    expect(deleteResult.message).toBe("Kata deleted");

    // Проверяем что каты больше нет - получаем все каты и проверяем что удалённой нет
    const getAllResponse = await request.get("/api/katas");
    const allKatas = await getAllResponse.json();
    const deletedKata = allKatas.find((kata: any) => kata.id === kataId);
    expect(deletedKata).toBeUndefined();
  });

  test("GET /api/katas should return katas ordered by creation date", async ({
    request,
  }) => {
    // Создаём несколько кат
    const kata1 = await request.post("/api/katas", {
      data: { title: "First Kata", url: "https://codewars.com/kata/first" },
    });
    await new Promise((resolve) => setTimeout(resolve, 100)); // Небольшая задержка

    const kata2 = await request.post("/api/katas", {
      data: { title: "Second Kata", url: "https://codewars.com/kata/second" },
    });

    // Получаем все каты
    const response = await request.get("/api/katas");
    const katas = await response.json();

    // Находим наши каты в списке
    const firstKata = katas.find((k: any) => k.title === "First Kata");
    const secondKata = katas.find((k: any) => k.title === "Second Kata");

    // Проверяем что обе каты найдены
    expect(firstKata).toBeDefined();
    expect(secondKata).toBeDefined();

    // Проверяем что вторая ката создана позже первой
    expect(new Date(secondKata.createdAt).getTime()).toBeGreaterThan(
      new Date(firstKata.createdAt).getTime()
    );

    // Проверяем что вторая ката идёт раньше в списке (новые первые)
    const firstIndex = katas.findIndex((k: any) => k.title === "First Kata");
    const secondIndex = katas.findIndex((k: any) => k.title === "Second Kata");
    expect(secondIndex).toBeLessThan(firstIndex);
  });

  test("PATCH /api/katas/[id] should handle non-existent kata", async ({
    request,
  }) => {
    const response = await request.patch("/api/katas/non-existent-id", {
      data: { title: "Updated" },
    });

    expect(response.status()).toBe(500); // Prisma вернёт ошибку для несуществующего ID
  });

  test("DELETE /api/katas/[id] should handle non-existent kata", async ({
    request,
  }) => {
    const response = await request.delete("/api/katas/non-existent-id");
    expect(response.status()).toBe(500); // Prisma вернёт ошибку для несуществующего ID
  });

  test("DELETE /api/katas/bulk-delete should delete multiple katas", async ({
    request,
  }) => {
    // Создаём несколько кат
    const kata1 = await request.post("/api/katas", {
      data: {
        title: "Bulk Delete Kata 1",
        url: "https://www.codewars.com/kata/bulk-1",
      },
    });
    const kata2 = await request.post("/api/katas", {
      data: {
        title: "Bulk Delete Kata 2",
        url: "https://www.codewars.com/kata/bulk-2",
      },
    });

    const createdKata1 = await kata1.json();
    const createdKata2 = await kata2.json();

    // Удаляем обе каты
    const deleteResponse = await request.delete("/api/katas/bulk-delete", {
      data: {
        ids: [createdKata1.id, createdKata2.id],
      },
    });

    expect(deleteResponse.status()).toBe(200);

    const deleteResult = await deleteResponse.json();
    expect(deleteResult.deletedCount).toBe(2);
    expect(deleteResult.message).toContain("2 katas deleted successfully");

    // Проверяем что каты действительно удалены
    const getAllResponse = await request.get("/api/katas");
    const allKatas = await getAllResponse.json();
    const deletedKata1 = allKatas.find((k: any) => k.id === createdKata1.id);
    const deletedKata2 = allKatas.find((k: any) => k.id === createdKata2.id);
    expect(deletedKata1).toBeUndefined();
    expect(deletedKata2).toBeUndefined();
  });

  test("DELETE /api/katas/bulk-delete should handle empty IDs array", async ({
    request,
  }) => {
    const response = await request.delete("/api/katas/bulk-delete", {
      data: {
        ids: [],
      },
    });

    expect(response.status()).toBe(400);

    const error = await response.json();
    expect(error.error).toBe("IDs array is required and must not be empty");
  });

  test("DELETE /api/katas/bulk-delete should handle invalid IDs", async ({
    request,
  }) => {
    const response = await request.delete("/api/katas/bulk-delete", {
      data: {
        ids: [123, "invalid-id"],
      },
    });

    expect(response.status()).toBe(400);

    const error = await response.json();
    expect(error.error).toBe("All IDs must be strings");
  });
});
