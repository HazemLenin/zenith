import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { courseChapters } from "./courseChapter.model";

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  chapterId: integer("chapter_id")
    .notNull()
    .references(() => courseChapters.id),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  chapter: one(courseChapters, {
    fields: [articles.chapterId],
    references: [courseChapters.id],
  }),
}));
