import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: "./src/test/setupTests.ts",
  },
  resolve: {
    tsconfigPaths: true,
  },
});
