import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
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

// Create SQLite database connection
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

async function clear() {
  console.log("🧹 Starting database cleanup...");

  try {
    // Disable foreign key checks
    sqlite.pragma("foreign_keys = OFF");

    // Delete all tables
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
    await db.delete(studentProfiles);
    await db.delete(instructorProfiles);
    await db.delete(users);

    // Re-enable foreign key checks
    sqlite.pragma("foreign_keys = ON");

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run the cleanup
clear().catch(console.error);
