import {
  sqliteTable,
  text,
  integer,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { instructorProfiles } from "./instructorProfile.model";

export const CourseStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type CourseStatusType = (typeof CourseStatus)[keyof typeof CourseStatus];

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull().default(0),
  instructorId: integer("instructor_id")
    .notNull()
    .references(() => instructorProfiles.id),
});

export const coursesRelations = relations(courses, ({ one }) => ({
  instructor: one(instructorProfiles, {
    fields: [courses.instructorId],
    references: [instructorProfiles.id],
  }),
}));
