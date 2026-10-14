import { test, expect } from "@playwright/test";
const isMobile = (info) => ["mobile", "android"].includes(info.project.name);

async function start(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Jouer la mission" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.locator("#modal-confirm").click();
}
async function move(page, milliseconds) {
  await page.keyboard.down("ArrowRight");
  await page.clock.runFor(milliseconds);
  await page.keyboard.up("ArrowRight");
}
async function secure(page) {
  await expect(page.locator("#interaction")).toBeVisible();
  await page.keyboard.press("e");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#modal-kicker")).toHaveText(
    "UN BON RÉFLEXE DE PLUS",
  );
  await page.locator("#modal-confirm").click();
}
async function finishSites(page, project) {
  for (let level = 0; level < 2; level++) {
    await move(page, 3700);
    await secure(page);
    await move(page, 8050);
    await secure(page);
    await move(page, 3000);
    await page.keyboard.down("ArrowRight");
    await page.keyboard.down(" ");
    await page.clock.runFor(1000);
    await page.keyboard.up(" ");
    await page.clock.runFor(4050);
    await page.keyboard.up("ArrowRight");
    await secure(page);
    await move(page, 8050);
    await secure(page);
    await move(page, 8050);
    await secure(page);
    await page.screenshot({
      path: `test-results/level-${level}-${project}.png`,
    });
    await move(page, 6000);
    await expect(page.locator("#summary")).toBeVisible();
    await expect(page.locator("#stats")).toContainText(
      level ? "10 / 10" : "5 / 5",
    );
    if (!level) {
      await page.locator("#next-level").click();
      await page.locator("#modal-confirm").click();
    }
  }
}
test("accueil lisible et sans débordement", async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Petit casque/ }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .querySelector("#hero")
            .getContext("2d")
            .getImageData(400, 300, 1, 1).data[3],
      ),
    )
    .toBe(255);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("pause, reprise et chronomètre", async ({ page }, info) => {
  test.skip(isMobile(info));
  await page.clock.install();
  await start(page);
  await move(page, 1500);
  const before = await page.locator("#clock").textContent();
  await page.locator("#pause").click();
  await page.evaluate(() => {
    const ctx = document.querySelector("#game").getContext("2d");
    const clear = ctx.clearRect.bind(ctx);
    window.pausedDraws = 0;
    ctx.clearRect = (...args) => {
      window.pausedDraws++;
      clear(...args);
    };
  });
  await page.clock.runFor(5000);
  expect(await page.evaluate(() => window.pausedDraws)).toBeLessThanOrEqual(1);
  await expect(page.locator("#clock")).toHaveText(before);
  await page.locator("#modal-confirm").click();
  await page.clock.runFor(1500);
  await expect(page.locator("#clock")).not.toHaveText(before);
});
test("une chute conserve les dangers sécurisés", async ({ page }, info) => {
  test.skip(isMobile(info));
  await page.clock.install();
  await start(page);
  await move(page, 3700);
  await secure(page);
  await move(page, 8050);
  await secure(page);
  // Deliberately walk into the gap without jumping.
  await move(page, 5000);
  await expect(page.locator("#route-hint")).toContainText(
    "Retour en zone sûre",
  );
  await expect(page.locator("#counter")).toContainText("2 / 5 sécurisés");
  await expect(page.locator("#summary")).toBeHidden();
});
test("parcours intégral au clavier, bilans, partage et mode dégradé", async ({
  page,
}, info) => {
  test.skip(isMobile(info));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/api/**", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Le tableau est temporairement indisponible.",
      }),
    }),
  );
  await page.clock.install();
  await start(page);
  await finishSites(page, info.project.name);
  await expect(page.locator("#summary-message")).toHaveText(
    "Site sécurisé : bravo, vous contribuez à la prévention des accidents.",
  );
  await expect(page.locator("#score-status")).toContainText("indisponible");
  await expect(page.locator("#share-text")).toContainText(
    "10 dangers sécurisés sur 10",
  );
  await expect(page.locator("#linkedin")).toHaveAttribute(
    "href",
    /linkedin\.com\/sharing\/share-offsite\/\?url=/,
  );
  await page.locator("#initials").fill("XYZ");
  await page.locator("#score-form button").click();
  await expect(page.locator("#score-status")).toContainText(
    "Inscription indisponible",
  );
  await page.screenshot({
    path: `test-results/final-${info.project.name}.png`,
    fullPage: true,
  });
  await page.locator("#replay").click();
  await page.locator("#modal-confirm").click();
  await expect(page.locator("#level-name")).toHaveText("Raffinerie");
  await expect(page.locator("#counter")).toContainText("0 / 5");
  await page.reload();
  await expect(page.locator("#home")).toBeVisible();
  expect(errors).toEqual([]);
});
test("inscription réelle et lecture depuis un second navigateur", async ({
  page,
  browser,
}, info) => {
  test.skip(info.project.name !== "chromium");
  test.setTimeout(150000);
  const began = Date.now();
  await page.clock.install();
  await start(page);
  await finishSites(page, "real-api");
  // The real API must observe at least the submitted active duration in wall time.
  // Do not bypass its signed token or plausibility checks to make the test pass.
  const remaining = 88000 - (Date.now() - began);
  if (remaining > 0)
    await new Promise((resolve) => setTimeout(resolve, remaining));
  await page.locator("#initials").fill("TST");
  await page.locator("#score-form button").click();
  await expect(page.locator("#score-status")).toContainText("Mission inscrite");
  await expect(page.locator("#leaderboard")).toContainText("TST");
  const other = await browser.newContext();
  const response = await other.request.get("http://127.0.0.1:18763/api/scores");
  expect(
    (await response.json()).scores.some((score) => score.initials === "TST"),
  ).toBeTruthy();
  await other.close();
  await page.screenshot({
    path: "test-results/final-real-api.png",
    fullPage: true,
  });
});
test("mobile : portrait, paysage, commandes tactiles et pause", async ({
  page,
}, info) => {
  test.skip(!isMobile(info));
  await page.clock.install();
  await start(page);
  await expect(page.locator("#orientation")).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator("#orientation")).toBeHidden();
  // A voluntary resume is required after orientation changes.
  if (await page.locator("#modal").isVisible())
    await page.locator("#modal-confirm").click();
  const right = page.locator('[data-control="right"]');
  await expect(right).toBeVisible();
  const box = await right.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.clock.runFor(3700);
  await page.mouse.up();
  await expect(page.locator("#interaction")).toBeVisible();
  await page.locator("#secure").tap();
  await expect(page.locator("#modal")).toBeVisible();
  await page.screenshot({
    path: `test-results/mobile-learning-${info.project.name}.png`,
  });
  await page.locator("#modal-confirm").tap();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#orientation")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
