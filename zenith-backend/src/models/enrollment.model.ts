import {
  pgTable,
  text,
  integer,
  serial,
  AnyPgColumn,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./course.model";
import { studentProfiles } from "./studentProfile.model";

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references((): AnyPgColumn => studentProfiles.id),
  courseId: integer("course_id")
    .notNull()
    .references((): AnyPgColumn => courses.id),
  paid: integer("paid").notNull(),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [enrollments.studentId],
    references: [studentProfiles.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));
