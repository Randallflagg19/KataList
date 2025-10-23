import { test, expect } from "@playwright/test";

test.describe("Kata App", () => {
  test.afterEach(async ({ request }) => {
    // Очищаем БД после каждого теста
    const response = await request.get("/api/katas");
    const katas = await response.json();

    // Удаляем все тестовые каты
    for (const kata of katas) {
      if (kata.title.startsWith("Test Kata ")) {
        await request.delete(`/api/katas/${kata.id}`);
      }
    }
  });

  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Проверяем заголовок
    await expect(
      page.getByRole("heading", { name: "🥋 Мои Каты" })
    ).toBeVisible();

    // Проверяем статистику
    await expect(page.getByText("Всего")).toBeVisible();
    await expect(page.getByText("Решено")).toBeVisible();
    await expect(page.getByText("В процессе")).toBeVisible();

    // Проверяем кнопку добавления каты
    await expect(page.getByText("+ Добавить новую кату")).toBeVisible();
  });

  test("should add a new kata", async ({ page }) => {
    await page.goto("/");

    // Кликаем на кнопку добавления каты
    await page.getByText("+ Добавить новую кату").click();

    // Заполняем форму с уникальным названием
    const timestamp = Date.now();
    const kataTitle = `Test Kata ${timestamp}`;

    await page.getByLabel("Название *").fill(kataTitle);
    await page
      .getByLabel("Ссылка на Codewars *")
      .fill("https://www.codewars.com/kata/test");
    await page.getByLabel("Сложность").selectOption("8kyu");
    await page.getByLabel("Заметки").fill("This is a test kata");

    // Отправляем форму
    await page.getByRole("button", { name: "Добавить" }).click();

    // Проверяем что ката добавилась
    await expect(page.getByRole("heading", { name: kataTitle })).toBeVisible();

    // Проверяем что форма закрылась (значит ката добавилась)
    await expect(page.getByText("+ Добавить новую кату")).toBeVisible();
  });

  test("should toggle kata completion", async ({ page }) => {
    await page.goto("/");

    // Находим первый чекбокс
    const checkbox = page.locator('input[type="checkbox"]').first();

    // Проверяем что чекбокс видим
    await expect(checkbox).toBeVisible();

    // Кликаем на чекбокс
    await checkbox.click();

    // Проверяем что ката отмечена как выполненная
    await expect(checkbox).toBeChecked();
  });

  test("should filter katas", async ({ page }) => {
    await page.goto("/");

    // Кликаем на фильтр "Активные"
    await page.getByRole("button", { name: /Активные/ }).click();

    // Проверяем что показываются только активные каты
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked();
    }
  });

  test("should validate form fields", async ({ page }) => {
    await page.goto("/");

    // Открываем форму
    await page.getByText("+ Добавить новую кату").click();

    // Пытаемся отправить пустую форму
    await page.getByRole("button", { name: "Добавить" }).click();

    // Проверяем что появились ошибки валидации
    await expect(page.getByText("Название обязательно")).toBeVisible();
    await expect(page.getByText("Некорректная ссылка")).toBeVisible();
  });
});
