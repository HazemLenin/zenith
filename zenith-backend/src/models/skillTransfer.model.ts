import {
  pgTable,
  text,
  integer,
  serial,
  AnyPgColumn,
  boolean as pgBoolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { skills } from "./skill.model";
import { studentProfiles } from "./studentProfile.model";
import { sessions } from "./session.model";

export const skillTransferStatusEnum = pgEnum("skill_transfer_status", [
  "pending",
  "in_progress",
  "finished",
]);

export const SkillTransferStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  FINISHED: "finished",
  // REJECTED: "rejected",
} as const;

export type SkillTransferStatus =
  (typeof SkillTransferStatus)[keyof typeof SkillTransferStatus];

export const skillTransfers = pgTable("skill_transfers", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references((): AnyPgColumn => studentProfiles.id),
  teacherId: integer("teacher_id")
    .notNull()
    .references((): AnyPgColumn => studentProfiles.id),
  skillId: integer("skill_id")
    .notNull()
    .references((): AnyPgColumn => skills.id),
  points: integer("points").notNull().default(0),
  done: pgBoolean("done").notNull().default(false),
  status: skillTransferStatusEnum("status")
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
