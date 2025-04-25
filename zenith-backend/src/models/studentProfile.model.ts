import { AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "drizzle-orm/sqlite-core";
import { UserRole, users } from "./user.model";
import { relations } from "drizzle-orm";

export const studentProfiles = sqliteTable("student_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references((): AnySQLiteColumn => users.id),
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
