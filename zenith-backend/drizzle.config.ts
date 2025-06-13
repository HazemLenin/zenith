import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? undefined
      : path.join(__dirname, "../.env"),
});

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
