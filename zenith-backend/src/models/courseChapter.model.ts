import {
  pgTable,
  text,
  integer,
  serial,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./course.model";

export const courseChapters = pgTable("course_chapters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  courseId: integer("course_id")
    .notNull()
    .references((): AnyPgColumn => courses.id),
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
