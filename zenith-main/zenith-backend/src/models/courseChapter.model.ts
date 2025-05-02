import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { courses } from "./course.model";

export const courseChapters = sqliteTable("course_chapters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  orderIndex: integer("order_index").notNull(),
});

export const courseChaptersRelations = relations(
  courseChapters,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseChapters.courseId],
      references: [courses.id],
    }),
  })
);
