import express from "express";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import * as schema from "./models";
import { createServer } from "http";
import { Server } from "socket.io";
// Load environment variables
dotenv.config();
declare module "express" {
  interface Request {
    user?: {
      id: number;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      role: string;
    };
  }
}
// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"],
  },
});
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
import chatRoutes from "./routes/chat.routes";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/chats", chatRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Optionally, join rooms based on user or chat
  socket.on("joinChat", (chatId) => {
    socket.join(`chat_${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io for use in controllers
export { io };

// Start server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
