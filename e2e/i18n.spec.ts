import { expect, test } from "@playwright/test";

test("defaults to English, left-to-right", async ({ page }) => {
  await page.goto("/sign-in");

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "en");
  await expect(html).toHaveAttribute("dir", "ltr");
});

test("honours Accept-Language when no cookie is set", async ({ browser }) => {
  const context = await browser.newContext({ locale: "ar-EG" });
  const page = await context.newPage();
  await page.goto("/sign-in");

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "ar");
  await expect(html).toHaveAttribute("dir", "rtl");

  await context.close();
});

test("the cookie wins over Accept-Language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "ar-EG" });
  await context.addCookies([
    {
      name: "language-tag",
      value: "en",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
  const page = await context.newPage();
  await page.goto("/sign-in");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await context.close();
});

test("switching locale re-renders the app in Arabic, RTL, from the server", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("button", { name: "Change language" }).click();
  await page.getByRole("menuitem", { name: "العربية" }).click();

  // setLocale writes the cookie and reloads, so the new document is
  // server-rendered in Arabic rather than swapped in on the client.
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  const cookies = await page.context().cookies();
  expect(cookies.find((cookie) => cookie.name === "language-tag")?.value).toBe(
    "ar",
  );
});

test("the Arabic locale is server-rendered, not hydrated in", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "ar-EG" });
  const page = await context.newPage();

  // Disabling JS proves the translation is in the SSR payload.
  await context.route("**/*.js", (route) => route.abort());
  const response = await page.goto("/sign-in");
  const html = (await response?.text()) ?? "";

  expect(html).toMatch(/<html[^>]*lang="ar"/);
  expect(html).toMatch(/<html[^>]*dir="rtl"/);
  // Arabic script present in the initial payload.
  expect(html).toMatch(/[؀-ۿ]/);

  await context.close();
});
