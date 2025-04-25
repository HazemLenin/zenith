import express from "express";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import * as schema from "./models";
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize SQLite database
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

// Import routes
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import skillsRoutes from "./routes/skills.routes";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/skills", skillsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
