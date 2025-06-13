import { execSync } from "child_process";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const runMigrations = () => {
  console.log("Starting database migration process...");

  try {
    // Generate migration files
    console.log("Generating migration files...");
    execSync("npx drizzle-kit generate:pg", { stdio: "inherit" });

    // Push migrations to database
    console.log("Pushing migrations to database...");
    execSync("npx drizzle-kit push:pg", { stdio: "inherit" });

    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migrations
runMigrations();
