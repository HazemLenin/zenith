import { Request, Response } from "express";
import { db } from "../index";
import { chats, messages, users } from "../models";
import { eq, or, desc, and } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { InferInsertModel } from "drizzle-orm";
import { io } from "../index";
import { ErrorViewModel } from "../viewmodels/error.viewmodel";

type NewMessage = InferInsertModel<typeof messages>;
type ChatUpdate = Partial<InferInsertModel<typeof chats>>;

export class ChatsController {
  // List all chats for the authenticated user, ordered by last message
  static async getChats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      // Create aliases for users table
      const user1 = alias(users, "user1");
      const user2 = alias(users, "user2");
      const userChats = await db
        .select({
          chat: chats,
          user1: {
            id: user1.id,
            firstName: user1.firstName,
            lastName: user1.lastName,
          },
          user2: {
            id: user2.id,
            firstName: user2.firstName,
            lastName: user2.lastName,
          },
        })
        .from(chats)
        .leftJoin(user1, eq(chats.user1Id, user1.id))
        .leftJoin(user2, eq(chats.user2Id, user2.id))
        .where(or(eq(chats.user1Id, userId), eq(chats.user2Id, userId)))
        .orderBy(desc(chats.updatedAt));
      // Only return the other user's data
      const result = userChats.map((row) => {
        const otherUser = row.chat.user1Id === userId ? row.user2 : row.user1;
        return {
          chat: row.chat,
          user: otherUser,
        };
      });
      res.json(result);
    } catch (error) {
      console.error("Get chats error:", error);
      res
        .status(500)
        .json(ErrorViewModel.internalError("Failed to fetch chats").toJSON());
    }
  }

  // Get messages for a specific chat, ordered from newest to oldest
  static async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const chatId = Number(req.params.chatId);

      // Check if user is part of the chat
      const chat = await db
        .select()
        .from(chats)
        .where(
          and(
            eq(chats.id, chatId),
            or(eq(chats.user1Id, userId), eq(chats.user2Id, userId))
          )
        )
        .get();

      if (!chat) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Chat not found").toJSON());
        return;
      }

      // Get messages
      const chatMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(desc(messages.createdAt));

      res.json(chatMessages);
    } catch (error) {
      console.error("Get messages error:", error);
      res
        .status(500)
        .json(
          ErrorViewModel.internalError("Failed to fetch messages").toJSON()
        );
    }
  }

  // Send a message in a chat
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const chatId = Number(req.params.chatId);
      const { content } = req.body;

      // Check if user is part of the chat
      const chat = await db
        .select()
        .from(chats)
        .where(
          and(
            eq(chats.id, chatId),
            or(eq(chats.user1Id, userId), eq(chats.user2Id, userId))
          )
        )
        .get();

      if (!chat) {
        res
          .status(404)
          .json(ErrorViewModel.notFound("Chat not found").toJSON());
        return;
      }

      // Insert message
      const [message] = await db
        .insert(messages)
        .values({
          chatId,
          senderId: userId,
          content,
        } as NewMessage)
        .returning();

      // Update chat's updatedAt
      await db
        .update(chats)
        .set({ updatedAt: new Date().toISOString() } as ChatUpdate)
        .where(eq(chats.id, chatId));

      // Emit WebSocket event here
      io.to(`chat_${chatId}`).emit("newMessage", message);

      res.status(201).json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res
        .status(500)
        .json(ErrorViewModel.internalError("Failed to send message").toJSON());
    }
  }
}
