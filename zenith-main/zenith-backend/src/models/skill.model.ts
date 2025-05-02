import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { skillCategories } from "./skillCategory.model";

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => skillCategories.id),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));
