import {
  sqliteTable,
  text,
  integer,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { instructorProfiles } from "./instructorProfile.model";
import { studentProfiles } from "./studentProfile.model";
import { chats } from "./chat.model";
import { messages } from "./message.model";
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

export type User = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ one, many }) => ({
  instructor: one(instructorProfiles, {
    fields: [users.instructorProfileId],
    references: [instructorProfiles.id],
  }),
  student: one(studentProfiles, {
    fields: [users.studentProfileId],
    references: [studentProfiles.id],
  }),
  chatsAsUser1: many(chats, { relationName: "user1" }),
  chatsAsUser2: many(chats, { relationName: "user2" }),
  sentMessages: many(messages, { relationName: "sender" }),
}));
