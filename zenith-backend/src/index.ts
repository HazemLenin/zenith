import express from "express";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import * as schema from "./models";
import { chats } from "./models/chat.model";
import { messages } from "./models/message.model";
import { createServer } from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import { and, eq, or } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";

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

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Changed to match your actual frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need to support cookies/auth
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"],
  },
});

// WebSocket authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.query.token;
    if (!token || typeof token !== "string") {
      return next(new Error("Authentication error: No token provided"));
    }

    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    // Store user data in socket
    socket.data.userId = decoded.id;
    next();
  } catch (error) {
    console.error("WebSocket authentication error:", error);
    next(new Error("Authentication error: Invalid token"));
  }
});

// Load OpenAPI specification
const openApiSpec = YAML.load(path.join(__dirname, "../../openapi.yaml"));

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

const port = 3000;

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
import coursesRoutes from "./routes/courses.routes";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/courses", coursesRoutes);

// Define the types needed for database operations
type ChatUpdate = Partial<InferInsertModel<typeof chats>>;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id, "User ID:", socket.data.userId);

  // Join a room for the user's own messages
  socket.join(`user_${socket.data.userId}`);

  // Optionally, join rooms based on user or chat
  socket.on("joinChat", (chatId) => {
    console.log(`User ${socket.data.userId} requested to join chat ${chatId}`);
    socket.join(`chat_${chatId}`);
    console.log(`User ${socket.data.userId} joined chat ${chatId}`);

    // Send confirmation back to client
    socket.emit("joinedChat", { chatId, status: "joined" });

    // Log all rooms this socket is in
    console.log(
      `Socket ${socket.id} is now in rooms:`,
      Array.from(socket.rooms)
    );
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
