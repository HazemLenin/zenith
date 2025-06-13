import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courseChapters } from "./courseChapter.model";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  chapterId: integer("chapter_id").references(() => courseChapters.id),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  chapter: one(courseChapters, {
    fields: [articles.chapterId],
    references: [courseChapters.id],
  }),
}));
