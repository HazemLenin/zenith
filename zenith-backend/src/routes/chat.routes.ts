import { Router } from "express";
import { ChatsController } from "../controllers/chats.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// List all chats for the authenticated user
router.get("/", authMiddleware, ChatsController.getChats);

// Create a new chat with another user
router.post("/", authMiddleware, ChatsController.createChat);

// Get messages for a specific chat
router.get("/:chatId/messages", authMiddleware, ChatsController.getMessages);

// Send a message in a chat
router.post("/:chatId/messages", authMiddleware, ChatsController.sendMessage);

export default router;
