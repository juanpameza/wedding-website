import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    // Server-module poisons/framework imports, stubbed for node tests.
    // Scoped to test.alias (exact-match regexes) so vitest's own module
    // resolution is untouched — a root resolve.alias here broke every suite.
    alias: [
      {
        find: /^server-only$/,
        replacement: path.resolve(__dirname, "test/stubs/server-only.ts"),
      },
      {
        find: /^next\/cache$/,
        replacement: path.resolve(__dirname, "test/stubs/next-cache.ts"),
      },
    ],
  },
});
