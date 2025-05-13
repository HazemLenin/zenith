import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { skills } from "./skill.model";
import { studentProfiles } from "./studentProfile.model";
export const SkillExchangeStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  FINISHED: "finished",
} as const;

export type SkillExchangeStatus =
  (typeof SkillExchangeStatus)[keyof typeof SkillExchangeStatus];

export const skillExchanges = sqliteTable("skill_exchanges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  student1Id: integer("student_1_id")
    .notNull()
    .references(() => studentProfiles.id),
  student2Id: integer("student_2_id")
    .notNull()
    .references(() => studentProfiles.id),
  skill1Id: integer("skill_1_id")
    .notNull()
    .references(() => skills.id),
  skill2Id: integer("skill_2_id")
    .notNull()
    .references(() => skills.id),
  points1: integer("points_1").notNull().default(0),
  points2: integer("points_2").notNull().default(0),
  done1: integer("done_1", { mode: "boolean" }).notNull().default(false),
  done2: integer("done_2", { mode: "boolean" }).notNull().default(false),
  status: text("status", {
    enum: [
      SkillExchangeStatus.PENDING,
      SkillExchangeStatus.IN_PROGRESS,
      SkillExchangeStatus.FINISHED,
    ],
  })
    .notNull()
    .default(SkillExchangeStatus.PENDING),
});

export const skillExchangesRelations = relations(skillExchanges, ({ one }) => ({
  student1: one(studentProfiles, {
    fields: [skillExchanges.student1Id],
    references: [studentProfiles.id],
  }),
  student2: one(studentProfiles, {
    fields: [skillExchanges.student2Id],
    references: [studentProfiles.id],
  }),
  skill1: one(skills, {
    fields: [skillExchanges.skill1Id],
    references: [skills.id],
  }),
  skill2: one(skills, {
    fields: [skillExchanges.skill2Id],
    references: [skills.id],
  }),
}));
