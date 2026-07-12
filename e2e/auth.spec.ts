import { expect, test } from "@playwright/test";

const CREDENTIALS = { email: "fake@fake.com", password: "fake12345" };

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByRole("textbox", { name: "Email" }).fill(CREDENTIALS.email);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(CREDENTIALS.password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("**/dashboard");
}

test("unauthenticated visitors are redirected to sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("a protected route preserves the intended destination", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?redirect=%2Fdashboard/);
});

test("signing in lands on the dashboard and survives a reload", async ({
  page,
}) => {
  await signIn(page);
  await expect(page.getByText("Home sweet home")).toBeVisible();

  // Full reload: proves the sealed session cookie round-trips on a fresh request.
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Home sweet home")).toBeVisible();
});

test("an authenticated visitor is redirected away from sign-in", async ({
  page,
}) => {
  await signIn(page);
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("signing out clears the session", async ({ page }) => {
  await signIn(page);

  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.waitForURL("**/sign-in");

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in/);
});
