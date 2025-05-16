import {
  sqliteTable,
  integer,
  text,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { chats } from "./chat.model";
import { users } from "./user.model";
import { relations, sql } from "drizzle-orm";

// Table for individual messages within a chat
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: integer("chat_id")
    .notNull()
    .references((): AnySQLiteColumn => chats.id),
  senderId: integer("sender_id")
    .notNull()
    .references((): AnySQLiteColumn => users.id),
  content: text("content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
}));
