import {
  sqliteTable,
  text,
  integer,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { instructorProfiles } from "./instructorProfile.model";
import { studentProfiles } from "./studentProfile.model";
import { relations } from "drizzle-orm";

export const UserRole = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", {
    enum: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
  })
    .notNull()
    .default(UserRole.STUDENT),
  instructorProfileId: integer("instructor_profile_id").references(
    (): AnySQLiteColumn => instructorProfiles.id
  ),
  studentProfileId: integer("student_profile_id").references(
    (): AnySQLiteColumn => studentProfiles.id
  ),
});

export const usersRelations = relations(users, ({ one }) => ({
  instructor: one(instructorProfiles),
  student: one(studentProfiles),
}));
