import {
  pgTable,
  text,
  integer,
  serial,
  AnyPgColumn,
  boolean as pgBoolean,
} from "drizzle-orm/pg-core";
import { skillTransfers } from "./skillTransfer.model";
import { relations } from "drizzle-orm";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  skillTransferId: integer("skill_transfer_id")
    .notNull()
    .references((): AnyPgColumn => skillTransfers.id),
  title: text("title").notNull(),
  points: integer("points").notNull(),
  completed: pgBoolean("completed").default(false),
  paid: pgBoolean("paid").default(false),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  skillTransfer: one(skillTransfers, {
    fields: [sessions.skillTransferId],
    references: [skillTransfers.id],
  }),
}));
