import {
  sqliteTable,
  text,
  integer,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { users } from "./user.model";
import { relations, sql } from "drizzle-orm";
import { messages } from "./message.model";

// Table for chat conversations between two users
export const chats = sqliteTable("chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  user1Id: integer("user1_id")
    .notNull()
    .references((): AnySQLiteColumn => users.id),
  user2Id: integer("user2_id")
    .notNull()
    .references((): AnySQLiteColumn => users.id),
});

// Relations
export const chatsRelations = relations(chats, ({ many, one }) => ({
  messages: many(messages),
  user1: one(users, {
    fields: [chats.user1Id],
    references: [users.id],
  }),
  user2: one(users, {
    fields: [chats.user2Id],
    references: [users.id],
  }),
}));
