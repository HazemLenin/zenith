import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  instructorProfiles,
  studentProfiles,
  skills,
  courses,
  courseChapters,
  articles,
  studentSkills,
  chats,
  messages,
  skillTransfers,
  sessions,
  users,
  videos,
  enrollments,
} from "../models";
import { config } from "dotenv";

// Load environment variables
config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function clear() {
  console.log("🧹 Starting database cleanup...");

  try {
    // Start a transaction
    await pool.query("BEGIN");
    // Defer all constraints
    await pool.query("SET CONSTRAINTS ALL DEFERRED");

    // Delete all tables in reverse order of dependencies
    await db.delete(messages);
    await db.delete(chats);
    await db.delete(sessions);
    await db.delete(skillTransfers);
    await db.delete(studentSkills);
    await db.delete(enrollments);
    await db.delete(videos);
    await db.delete(articles);
    await db.delete(courseChapters);
    await db.delete(courses);
    await db.delete(skills);

    // Handle circular reference: first nullify foreign key references in users table
    await pool.query(
      "UPDATE users SET student_profile_id = NULL, instructor_profile_id = NULL"
    );

    // Now we can safely delete the profile tables
    await db.delete(studentProfiles);
    await db.delete(instructorProfiles);
    await db.delete(users);

    // Commit the transaction
    await pool.query("COMMIT");

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    // Rollback in case of error
    await pool.query("ROLLBACK");
    console.error("❌ Error clearing database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the cleanup
clear().catch(console.error);
