import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courseChapters } from "./courseChapter.model";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  chapterId: integer("chapter_id")
    .notNull()
    .references(() => courseChapters.id),
});

export const videosRelations = relations(videos, ({ one }) => ({
  chapter: one(courseChapters, {
    fields: [videos.chapterId],
    references: [courseChapters.id],
  }),
}));
