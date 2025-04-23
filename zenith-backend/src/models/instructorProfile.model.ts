import { AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core";

import { sqliteTable } from "drizzle-orm/sqlite-core";
import { UserRole, users } from "./user.model";
import { relations } from "drizzle-orm";

export const instructorProfiles = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references((): AnySQLiteColumn => users.id),
  coursesCount: integer("courses_count").default(0),
});

export const instructorProfilesRelations = relations(
  instructorProfiles,
  ({ one }) => ({
    user: one(users),
  })
);
