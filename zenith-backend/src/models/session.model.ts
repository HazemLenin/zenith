import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { skillTransfers } from "./skillTransfer.model";
import { relations } from "drizzle-orm";

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  skillTransferId: text("skill_transfer_id")
    .notNull()
    .references(() => skillTransfers.id),
  title: text("title").notNull(),
  points: integer("points").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  paid: integer("paid", { mode: "boolean" }).default(false),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  skillTransfer: one(skillTransfers, {
    fields: [sessions.skillTransferId],
    references: [skillTransfers.id],
  }),
}));
