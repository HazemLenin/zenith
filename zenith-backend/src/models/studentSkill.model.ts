import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { studentProfiles } from "./studentProfile.model";
import { skills } from "./skill.model";

export const StudentSkillType = {
  LEARNED: "learned",
  NEEDED: "needed",
} as const;

export type StudentSkillTypeType =
  (typeof StudentSkillType)[keyof typeof StudentSkillType];

export const studentSkills = pgTable("student_skills", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => studentProfiles.id),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id),
  type: text("type", {
    enum: [StudentSkillType.LEARNED, StudentSkillType.NEEDED],
  }).notNull(),
  points: integer("points").notNull().default(0),
  description: text("description"),
});

export const studentSkillsRelations = relations(studentSkills, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [studentSkills.studentId],
    references: [studentProfiles.id],
  }),
  skill: one(skills, {
    fields: [studentSkills.skillId],
    references: [skills.id],
  }),
}));
