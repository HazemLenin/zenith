import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const skillCategories = sqliteTable("skill_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  minPoints: integer("min_points").notNull().default(0),
  maxPoints: integer("max_points").notNull(),
});
