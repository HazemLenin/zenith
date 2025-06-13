import { AnyPgColumn, integer, serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { UserRole, users } from "./user.model";
import { relations } from "drizzle-orm";

export const instructorProfiles = pgTable("instructor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references((): AnyPgColumn => users.id),
  coursesCount: integer("courses_count").default(0),
});

export const instructorProfilesRelations = relations(
  instructorProfiles,
  ({ one }) => ({
    user: one(users),
  })
);
