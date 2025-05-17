import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { skills } from "./skill.model";
import { studentProfiles } from "./studentProfile.model";
import { sessions } from "./session.model";
export const SkillTransferStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  FINISHED: "finished",
  // REJECTED: "rejected",
} as const;

export type SkillTransferStatus =
  (typeof SkillTransferStatus)[keyof typeof SkillTransferStatus];

export const skillTransfers = sqliteTable("skill_transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id")
    .notNull()
    .references(() => studentProfiles.id),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => studentProfiles.id),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id),
  points: integer("points").notNull().default(0),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  status: text("status", {
    enum: [
      SkillTransferStatus.PENDING,
      SkillTransferStatus.IN_PROGRESS,
      SkillTransferStatus.FINISHED,
      // SkillTransferStatus.REJECTED,
    ],
  })
    .notNull()
    .default(SkillTransferStatus.PENDING),
});

export const skillTransfersRelations = relations(
  skillTransfers,
  ({ one, many }) => ({
    student: one(studentProfiles, {
      fields: [skillTransfers.studentId],
      references: [studentProfiles.id],
    }),
    teacher: one(studentProfiles, {
      fields: [skillTransfers.teacherId],
      references: [studentProfiles.id],
    }),
    skill: one(skills, {
      fields: [skillTransfers.skillId],
      references: [skills.id],
    }),
    sessions: many(sessions),
  })
);
