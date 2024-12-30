import { defineConfig } from "drizzle-kit";
import { config } from "@hama/config";

export default defineConfig({
  schema: "./src/schemas/index.ts",
  out: "./src/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: config.database.url,
  },
});
