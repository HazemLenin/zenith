import {
  pgTable,
  text,
  serial,
  pgEnum,
  integer,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { instructorProfiles } from "./instructorProfile.model";
import { studentProfiles } from "./studentProfile.model";
import { chats } from "./chat.model";
import { messages } from "./message.model";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "instructor",
  "student",
]);

export const UserRole = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default(UserRole.STUDENT),
  instructorProfileId: integer("instructor_profile_id").references(
    (): AnyPgColumn => instructorProfiles.id
  ),
  studentProfileId: integer("student_profile_id").references(
    (): AnyPgColumn => studentProfiles.id
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
