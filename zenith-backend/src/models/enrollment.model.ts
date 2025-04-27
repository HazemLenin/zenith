import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { courses } from "./course.model";
import { studentProfiles } from "./studentProfile.model";

export const enrollments = sqliteTable("enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id")
    .notNull()
    .references(() => studentProfiles.id),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  paid: integer("paid").notNull(),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
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
