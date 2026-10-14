import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 120000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:18763",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "webkit" },
    },
    { name: "android", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    env: { OSCAR_DATA_DIR: "./data/browser-tests" },
    command:
      ".venv/bin/python -m flask --app server.app:create_app run --host 127.0.0.1 --port 18763",
    url: "http://127.0.0.1:18763/api/health",
    reuseExistingServer: false,
    timeout: 15000,
  },
});
