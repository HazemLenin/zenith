import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});
