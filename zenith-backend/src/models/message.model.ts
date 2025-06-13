import {
  pgTable,
  integer,
  text,
  serial,
  AnyPgColumn,
  timestamp,
} from "drizzle-orm/pg-core";
import { chats } from "./chat.model";
import { users } from "./user.model";
import { relations, sql } from "drizzle-orm";

// Table for individual messages within a chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .notNull()
    .references((): AnyPgColumn => chats.id),
  senderId: integer("sender_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
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
