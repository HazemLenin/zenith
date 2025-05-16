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
} from "../models";

// Create SQLite database connection
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

async function clear() {
  console.log("🧹 Starting database cleanup...");

  try {
    // Delete in reverse order of dependencies
    await db.delete(sessions);
    await db.delete(skillTransfers);
    await db.delete(messages);
    await db.delete(chats);
    await db.delete(studentSkills);
    await db.delete(articles);
    await db.delete(courseChapters);
    await db.delete(courses);
    await db.delete(skills);
    await db.delete(instructorProfiles);
    await db.delete(studentProfiles);
    await db.delete(users);

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
