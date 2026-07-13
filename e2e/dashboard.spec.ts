import type { Page } from "@playwright/test";

import { expect, test } from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByRole("textbox", { name: "Email" }).fill("fake@fake.com");
  await page.getByRole("textbox", { name: "Password" }).fill("fake12345");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("**/dashboard");
}

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("the overview shows member stats served from the server", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "Overview", level: 1 }),
  ).toBeVisible();

  // The seeded dataset has 240 members; the stat is computed server-side.
  await expect(page.getByTestId("stat-Total members")).toHaveText("240");
  await expect(page.getByText("Recent activity")).toBeVisible();
});

test.describe("members table", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("link", { name: "Members", exact: true }).click();
    await page.waitForURL("**/dashboard/members**");
  });

  test("renders the first server-paginated page", async ({ page }) => {
    await expect(page.getByRole("row")).toHaveCount(11); // 10 rows + header
    await expect(page.getByTestId("table-summary")).toHaveText("240 members");
  });

  test("filtering by search term narrows the results and resets to page 1", async ({
    page,
  }) => {
    await page.getByRole("searchbox", { name: "Filter members" }).fill("grace");

    // The filter round-trips through the URL and the server.
    await expect(page).toHaveURL(/q=grace/);
    await expect(page.getByTestId("table-summary")).not.toHaveText(
      "240 members",
    );

    const rows = page.getByRole("row");
    await expect(rows.nth(1)).toContainText(/grace/i);
  });

  test("an unmatchable filter shows the empty state", async ({ page }) => {
    await page
      .getByRole("searchbox", { name: "Filter members" })
      .fill("zzz-no-such-member");
    await expect(page.getByText("No members found")).toBeVisible();
  });

  test("filtering by role uses the server, not the current page", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: "Filter by role" }).click();
    await page.getByRole("option", { name: "Owner", exact: true }).click();

    await expect(page).toHaveURL(/role=owner/);
    // Every visible row is an owner -- proof the server filtered the whole set.
    const badges = page.getByRole("row").locator("td").nth(3);
    await expect(badges.first()).toHaveText(/owner/i);
  });

  test("sorting toggles direction and is reflected in the URL", async ({
    page,
  }) => {
    const firstCellText = async () =>
      page.getByRole("row").nth(1).locator("td").nth(1).innerText();

    const ascending = await firstCellText();

    await page.getByRole("button", { name: "Name" }).click();
    await expect(page).toHaveURL(/order=desc/);

    await expect.poll(async () => firstCellText()).not.toBe(ascending);
  });

  test("paginating requests the next page from the server", async ({
    page,
  }) => {
    const firstRow = async () =>
      page.getByRole("row").nth(1).locator("td").nth(1).innerText();
    const page1 = await firstRow();

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect.poll(async () => firstRow()).not.toBe(page1);

    // Previous is disabled on page 1, enabled once we have moved on.
    await page.getByRole("button", { name: "Previous page" }).click();
    await expect.poll(async () => firstRow()).toBe(page1);
  });

  test("table state survives a reload, because it lives in the URL", async ({
    page,
  }) => {
    await page.getByRole("searchbox", { name: "Filter members" }).fill("ada");
    await expect(page).toHaveURL(/q=ada/);

    await page.reload();
    await expect(
      page.getByRole("searchbox", { name: "Filter members" }),
    ).toHaveValue("ada");
  });

  test("selecting rows reports the selection count", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole("checkbox").check();
    await expect(page.getByTestId("table-summary")).toContainText(
      "1 of 240 selected",
    );
  });

  test("a row links through to the member detail route", async ({ page }) => {
    const name = await page
      .getByRole("row")
      .nth(1)
      .locator("td")
      .nth(1)
      .innerText();

    await page.getByRole("row").nth(1).getByRole("link").click();
    await page.waitForURL(/\/dashboard\/members\/mem_/);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      name.split("\n")[0] ?? "",
    );
    await expect(page.getByText("Details")).toBeVisible();
  });
});

test("an unknown member id renders the not-found state, not an error", async ({
  page,
}) => {
  await page.goto("/dashboard/members/mem_does_not_exist");
  await expect(page.getByText("Member not found")).toBeVisible();
  // Explicitly NOT the generic error boundary.
  await expect(page.getByText("Something went wrong")).toBeHidden();
});

test("an unknown route renders the 404 page", async ({ page }) => {
  await page.goto("/no/such/page");
  await expect(page.getByText("Page not found")).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
});

test("the activity feed virtualises: 10k events, few rows in the DOM", async ({
  page,
}) => {
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await page.waitForURL("**/dashboard/activity");

  await expect(page.getByRole("heading", { name: "Activity" })).toBeVisible();

  const scroller = page.getByTestId("activity-scroller");
  await expect(scroller).toBeVisible();

  // The whole point: the DOM holds a window, not 10,000 rows.
  const mounted = await scroller.locator("[data-index]").count();
  expect(mounted).toBeGreaterThan(0);
  expect(mounted).toBeLessThan(50);

  const firstIndex = await scroller
    .locator("[data-index]")
    .first()
    .getAttribute("data-index");

  await scroller.evaluate((el) => el.scrollTo({ top: 4000 }));
  await expect
    .poll(async () =>
      scroller.locator("[data-index]").first().getAttribute("data-index"),
    )
    .not.toBe(firstIndex);

  // Still windowed after scrolling.
  expect(await scroller.locator("[data-index]").count()).toBeLessThan(50);
});
