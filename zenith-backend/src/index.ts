import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
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
import { createProxyMiddleware } from "http-proxy-middleware";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Log environment variables for debugging
console.log("Environment:", {
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  PORT: process.env.PORT,
});

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

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Initialize PostgreSQL database
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/zenith",
});
export const db = drizzle(pool, { schema });

// Import routes
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import skillsRoutes from "./routes/skills.routes";
import chatRoutes from "./routes/chat.routes";
import coursesRoutes from "./routes/courses.routes";
import skillTransfersRoutes from "./routes/skillTransfers.routes";

// Use API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/skill-transfers", skillTransfersRoutes);

// Load OpenAPI specification
const openApiSpec = YAML.load(path.join(__dirname, "../openapi.yaml"));

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Development proxy configuration - AFTER API routes
if (process.env.NODE_ENV === "development") {
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
      ws: true,
      // Don't proxy API routes
      pathRewrite: (path) => {
        if (path.startsWith("/api")) {
          return path; // Keep API routes as is
        }
        return path;
      },
      // Only proxy non-API routes
      router: (req) => {
        if (req.url.startsWith("/api")) {
          return null; // Don't proxy API routes
        }
        return "http://localhost:5173";
      },
      // Add timeout options
      proxyTimeout: 30000,
      timeout: 30000,
    })
  );
} else {
  // Production: Serve static files from the frontend build
  const frontendBuildPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendBuildPath));

  // Handle SPA routing - send all non-API requests to index.html
  app.get("*", (req, res, next) => {
    if (!req.url.startsWith("/api")) {
      res.sendFile(path.join(frontendBuildPath, "index.html"));
    } else {
      next();
    }
  });
}

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
httpServer.listen(process.env.PORT || 4200, () => {
  console.log(`Server is running on port ${process.env.PORT || 4200}`);
});
