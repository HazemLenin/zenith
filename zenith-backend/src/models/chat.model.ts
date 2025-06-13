import {
  pgTable,
  text,
  integer,
  serial,
  AnyPgColumn,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { relations, sql } from "drizzle-orm";
import { messages } from "./message.model";

// Table for chat conversations between two users
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  user1Id: integer("user1_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  user2Id: integer("user2_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
});

// Relations
export const chatsRelations = relations(chats, ({ many, one }) => ({
  messages: many(messages),
  user1: one(users, {
    fields: [chats.user1Id],
    references: [users.id],
    relationName: "user1",
  }),
  user2: one(users, {
    fields: [chats.user2Id],
    references: [users.id],
    relationName: "user2",
  }),
}));
