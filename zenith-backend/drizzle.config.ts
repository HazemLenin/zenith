import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

export default defineConfig({
  schema: "./src/models",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/zenith",
  },
});
