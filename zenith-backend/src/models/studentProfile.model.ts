import { AnyPgColumn, integer, serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { UserRole, users } from "./user.model";
import { relations } from "drizzle-orm";

export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references((): AnyPgColumn => users.id),
  points: integer("points").default(0),
});

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [studentProfiles.userId],
      references: [users.id],
    }),
  })
);
