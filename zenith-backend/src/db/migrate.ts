import { execSync } from "child_process";

const runMigrations = () => {
  console.log("Starting database migration process...");

  try {
    // Generate migration files
    console.log("Generating migration files...");
    execSync("npx drizzle-kit generate", { stdio: "inherit" });

    // Push migrations to database
    console.log("Pushing migrations to database...");
    execSync("npx drizzle-kit push", { stdio: "inherit" });

    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migrations
runMigrations();
