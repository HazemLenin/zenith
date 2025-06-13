import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";
import { execSync } from "child_process";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const runMigrations = async () => {
  console.log("Starting database migration process...");

  try {
    // Generate migration files
    console.log("Generating migration files...");
    execSync("drizzle-kit generate:pg", { stdio: "inherit" });

    // Connect to database
    const pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/zenith",
    });

    const db = drizzle(pool);

    // Push migrations to database
    console.log("Pushing migrations to database...");
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../../drizzle"),
    });

    console.log("Migrations completed successfully!");
    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migrations
runMigrations();
