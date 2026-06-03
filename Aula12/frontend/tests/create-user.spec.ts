import { expect, test } from "@playwright/test";

test("creates a user from the form", async ({ page }) => {
  const email = `grace-${Date.now()}@example.com`;

  await page.goto("/");

  await page.getByLabel("Nome").fill("Grace Hopper");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Criar usuario" }).click();

  await expect(page.getByRole("heading", { name: "Usuario criado com sucesso" })).toBeVisible();
  await expect(page.getByText("Grace Hopper")).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
});

test("searches for a user by email", async ({ page }) => {
  const email = `ada-${Date.now()}@example.com`;

  await page.goto("/");

  await page.getByLabel("Nome").fill("Ada Lovelace");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Criar usuario" }).click();
  await expect(page.getByRole("heading", { name: "Usuario criado com sucesso" })).toBeVisible();

  await page.getByLabel("E-mail para busca").fill(email);
  await page.getByRole("button", { name: "Buscar usuario" }).click();

  const searchResult = page.locator("article", { has: page.getByRole("heading", { name: "Usuario encontrado" }) });

  await expect(page.getByRole("heading", { name: "Usuario encontrado" })).toBeVisible();
  await expect(searchResult.getByText("Ada Lovelace")).toBeVisible();
  await expect(searchResult.getByText(email)).toBeVisible();
});
