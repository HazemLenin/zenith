import express from "express";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize SQLite database
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

// Import routes
import userRoutes from "./routes/user.routes";

// Use routes
app.use("/api/users", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
