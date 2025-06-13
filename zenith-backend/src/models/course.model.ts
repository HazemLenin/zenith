import {
  pgTable,
  text,
  integer,
  serial,
  AnyPgColumn,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { instructorProfiles } from "./instructorProfile.model";

export const courseStatusEnum = pgEnum("course_status", [
  "pending",
  "approved",
  "rejected",
]);

export const CourseStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type CourseStatusType = (typeof CourseStatus)[keyof typeof CourseStatus];

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull().default(0),
  instructorId: integer("instructor_id")
    .notNull()
    .references((): AnyPgColumn => instructorProfiles.id),
});

export const coursesRelations = relations(courses, ({ one }) => ({
  instructor: one(instructorProfiles, {
    fields: [courses.instructorId],
    references: [instructorProfiles.id],
  }),
}));
