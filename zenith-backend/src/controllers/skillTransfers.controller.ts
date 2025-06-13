import { Request, Response } from "express";
import { db } from "../db";
import {
  sessions,
  skills,
  skillTransfers,
  SkillTransferStatus,
  studentProfiles,
  studentSkills,
  StudentSkillType,
  users,
} from "../models";
import { desc, eq, and } from "drizzle-orm";
import { title } from "process";
import { point } from "drizzle-orm/pg-core";
import { count } from "drizzle-orm";

export class SkillTransfersController {
  static async requestSkillTransfer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { skillId, teacherId } = req.body;

      // Validate input
      if (typeof skillId != "number" || typeof teacherId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Check if the skill exists
      const skill = await db
        .select()
        .from(skills)
        .where(eq(skills.id, skillId))
        .then((results) => results[0]);

      if (!skill) {
        res.status(404).json({ message: "Skill not found" });
        return;
      }

      // Get student profile
      const studentProfile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, req.user.id))
        .then((results) => results[0]);

      if (!studentProfile) {
        res.status(404).json({ message: "Student profile not found" });
        return;
      }

      // Check for existing skill transfer request
      const existingTransfer = await db
        .select()
        .from(skillTransfers)
        .where(
          and(
            eq(skillTransfers.skillId, skillId),
            eq(skillTransfers.studentId, studentProfile.id),
            eq(skillTransfers.teacherId, teacherId),
            eq(skillTransfers.status, "pending")
          )
        )
        .then((results) => results[0]);

      if (existingTransfer) {
        res
          .status(400)
          .json({ message: "Skill transfer request already exists" });
        return;
      }

      // Create a new skill transfer request
      const newRequest = {
        studentId: studentProfile.id,
        skillId,
        teacherId,
        status: "pending" as const,
      };

      await db.insert(skillTransfers).values(newRequest);

      res.status(201).json({ message: "Skill transfer request created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getTeachersSearch(req: Request, res: Response): Promise<void> {
    try {
      const skillId = Number(req.query.skillId);
      const userId = req.user.id;

      // Validate input
      if (typeof skillId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Get student profile
      const studentProfile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userId))
        .then((results) => results[0]);

      if (!studentProfile) {
        res.status(404).json({ message: "Student profile not found" });
        return;
      }

      // Fetch teachers who can teach the specified skill
      const teachers = await db
        .select()
        .from(studentSkills)
        .innerJoin(
          studentProfiles,
          eq(studentSkills.studentId, studentProfiles.id)
        )
        .innerJoin(users, eq(studentProfiles.userId, users.id))
        .where(
          and(
            eq(studentSkills.skillId, skillId),
            eq(studentSkills.type, StudentSkillType.LEARNED)
          )
        )
        .then(async (results) => {
          // Filter out teachers who already have an active skill transfer with this student
          const filteredResults = await Promise.all(
            results.map(async (result) => {
              const existingTransfer = await db
                .select()
                .from(skillTransfers)
                .where(
                  and(
                    eq(skillTransfers.skillId, skillId),
                    eq(skillTransfers.studentId, studentProfile.id),
                    eq(skillTransfers.teacherId, result.student_profiles.id),
                    eq(skillTransfers.status, "pending")
                  )
                )
                .then((transfers) => transfers[0]);

              if (existingTransfer) {
                return null;
              }

              return {
                teacherId: result.student_profiles.id,
                points: result.student_skills.points,
                teacherFirstName: result.users.firstName,
                teacherLastName: result.users.lastName,
                description: result.student_skills.description,
              };
            })
          );

          return filteredResults.filter((result) => result !== null);
        });

      res.status(200).json(teachers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMyRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;

      // Get teacher's student profile
      const teacherProfile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userId))
        .then((results) => results[0]);

      if (!teacherProfile) {
        res.status(404).json({ message: "Teacher profile not found" });
        return;
      }

      // Fetch skill transfer requests for the teacher, ordered by newest first
      const requests = await db
        .select({
          id: skillTransfers.id,
          studentFirstname: users.firstName,
          studentLastname: users.lastName,
          skillId: skillTransfers.skillId,
          skillTitle: skills.title,
          skillPoints: skillTransfers.points,
        })
        .from(skillTransfers)
        .innerJoin(
          studentProfiles,
          eq(skillTransfers.studentId, studentProfiles.id)
        )
        .innerJoin(users, eq(studentProfiles.userId, users.id))
        .innerJoin(skills, eq(skillTransfers.skillId, skills.id))
        .where(
          and(
            eq(skillTransfers.teacherId, teacherProfile.id),
            eq(skillTransfers.status, SkillTransferStatus.PENDING)
          )
        )
        .orderBy(desc(skillTransfers.id));

      res.status(200).json(requests);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async rejectRequest(req: Request, res: Response): Promise<void> {
    try {
      const skillTransferId = parseInt(req.params.skillTransferId);

      // Validate input
      if (typeof skillTransferId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Delete the skill transfer request
      await db
        .delete(skillTransfers)
        .where(eq(skillTransfers.id, skillTransferId));

      res.status(200).json({ message: "Skill transfer request rejected" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async acceptRequest(req: Request, res: Response): Promise<void> {
    try {
      const skillTransferId = parseInt(req.params.skillTransferId);
      const sessionData = req.body; // Assuming session data is sent in the request body
      // Validate input
      if (typeof skillTransferId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }
      sessionData.forEach(async (element) => {
        const newSession = {
          skillTransferId: skillTransferId,
          title: element.sessionTitle,
          points: element.points,
        };

        await db.insert(sessions).values(newSession);
      });

      // Update the skill transfer request status to "accepted"
      await db
        .update(skillTransfers)
        .set({ status: SkillTransferStatus.IN_PROGRESS })
        .where(eq(skillTransfers.id, skillTransferId));

      res.status(200).json({ message: "Skill transfer request accepted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMySkillTransfers(req: Request, res: Response): Promise<void> {
    try {
      const studentProfileId = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, req.user.id))
        .then((res) => res[0].id);

      const type = req.query.type as string;

      // Validate input
      if (
        !type ||
        !Object.values(StudentSkillType).includes(
          type as (typeof StudentSkillType)[keyof typeof StudentSkillType]
        )
      ) {
        res.status(400).json({
          message: "Invalid type. Must be either 'learned' or 'needed'",
        });
        return;
      }

      // Build query with all conditions at once
      const transfers = await db
        .select({
          id: skillTransfers.id,
          studentFirstname: users.firstName,
          studentLastname: users.lastName,
          teacherId: skillTransfers.teacherId,
          points: skillTransfers.points,
          status: skillTransfers.status,
        })
        .from(skillTransfers)
        .innerJoin(
          studentProfiles,
          eq(skillTransfers.studentId, studentProfiles.id)
        )
        .innerJoin(users, eq(studentProfiles.userId, users.id))
        .where(
          type === StudentSkillType.LEARNED
            ? eq(skillTransfers.teacherId, studentProfileId)
            : eq(skillTransfers.studentId, studentProfileId)
        )
        .then(async (results) => {
          return await Promise.all(
            results.map(async (result) => {
              // Get teacher information
              const teacher = await db
                .select({
                  firstName: users.firstName,
                  lastName: users.lastName,
                })
                .from(users)
                .innerJoin(
                  studentProfiles,
                  eq(studentProfiles.userId, users.id)
                )
                .where(eq(studentProfiles.id, result.teacherId))
                .then((res) => res[0]);

              const sessionsCount = await db
                .select({ count: count(sessions.id) })
                .from(sessions)
                .where(eq(sessions.skillTransferId, result.id));
              const completedSessionsCount = await db
                .select({ count: count(sessions.id) })
                .from(sessions)
                .where(
                  and(
                    eq(sessions.skillTransferId, result.id),
                    eq(sessions.completed, true)
                  )
                );
              const paidSessionsCount = await db
                .select({ count: count(sessions.id) })
                .from(sessions)
                .where(
                  and(
                    eq(sessions.skillTransferId, result.id),
                    eq(sessions.paid, true)
                  )
                );

              return {
                id: result.id,
                studentFirstname: result.studentFirstname,
                studentLastname: result.studentLastname,
                teacherFirstname: teacher.firstName,
                teacherLastname: teacher.lastName,
                sessions: sessionsCount[0]["count"],
                completedSessions: completedSessionsCount[0]["count"],
                points: result.points,
                paid: paidSessionsCount[0]["count"],
                status: result.status,
              };
            })
          );
        });

      res.status(200).json(transfers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getTransferDetails(req: Request, res: Response): Promise<void> {
    try {
      const skillTransferId = parseInt(req.params.skillTransferId);

      // Validate input
      if (typeof skillTransferId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Fetch skill transfer details
      const transferDetails = await db
        .select()
        .from(skillTransfers)
        .innerJoin(
          studentProfiles,
          eq(skillTransfers.studentId, studentProfiles.id)
        )
        .innerJoin(users, eq(studentProfiles.userId, users.id))
        .innerJoin(skills, eq(skillTransfers.skillId, skills.id))
        .where(eq(skillTransfers.id, skillTransferId))
        .then(async (results) => {
          if (results.length === 0) {
            return null;
          }

          const result = results[0];

          const sessionsList = await db
            .select()
            .from(sessions)
            .where(eq(sessions.skillTransferId, skillTransferId))
            .then((sessionResults) =>
              sessionResults.map((session) => ({
                id: session.id,
                title: session.title,
                points: session.points,
                completed: session.completed,
                paid: session.paid,
              }))
            );

          const teacher = await db
            .select({
              firstName: users.firstName,
              lastName: users.lastName,
              username: users.username,
            })
            .from(users)
            .innerJoin(studentProfiles, eq(studentProfiles.userId, users.id))
            .where(eq(studentProfiles.id, result.skill_transfers.teacherId))
            .then((results) => results[0]);

          const sessionsCount = sessionsList.length;
          const completedSessionsCount = sessionsList.filter(
            (session) => session.completed
          ).length;

          return {
            skillTitle: result.skills.title,
            teacherFirstName: teacher.firstName,
            teacherLastName: teacher.lastName,
            teacherUsername: teacher.username,
            studentFirstName: result.users.firstName,
            studentLastName: result.users.lastName,
            studentUsername: result.users.username,
            points: result.skill_transfers.points,
            sessionsCount,
            completedSessionsCount,
            sessions: sessionsList,
          };
        });

      if (!transferDetails) {
        res.status(404).json({ message: "Skill transfer not found" });
        return;
      }

      res.status(200).json(transferDetails);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private static async checkAndUpdateTransferStatus(
    skillTransferId: number
  ): Promise<void> {
    // Get all sessions for this transfer
    const allSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.skillTransferId, skillTransferId));

    // Check if all sessions are completed and paid
    const allCompletedAndPaid = allSessions.every(
      (session) => session.completed && session.paid
    );

    if (allCompletedAndPaid) {
      // Update skill transfer status to finished
      await db
        .update(skillTransfers)
        .set({ status: SkillTransferStatus.FINISHED })
        .where(eq(skillTransfers.id, skillTransferId));
    }
  }

  static async completeSession(req: Request, res: Response): Promise<void> {
    try {
      const { skillTransferId, sessionId } = req.params;
      // Validate input
      if (!Number(skillTransferId) || !Number(sessionId)) {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Get teacher's student profile
      const teacherProfile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, req.user.id))
        .then((results) => results[0]);

      if (!teacherProfile) {
        res.status(404).json({ message: "Teacher profile not found" });
        return;
      }

      // Check if user is the teacher for this skill transfer
      const transfer = await db
        .select()
        .from(skillTransfers)
        .where(eq(skillTransfers.id, Number(skillTransferId)))
        .then((results) => results[0]);

      if (!transfer) {
        res.status(404).json({ message: "Skill transfer not found" });
        return;
      }

      if (transfer.teacherId !== teacherProfile.id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      // Update the session to mark it as completed
      await db
        .update(sessions)
        .set({ completed: true })
        .where(
          and(
            eq(sessions.id, Number(sessionId)),
            eq(sessions.skillTransferId, Number(skillTransferId))
          )
        );

      // Check if all sessions are completed and paid
      await SkillTransfersController.checkAndUpdateTransferStatus(
        Number(skillTransferId)
      );

      res.status(200).json({ message: "Session marked as completed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async paySession(req: Request, res: Response): Promise<void> {
    try {
      let { skillTransferId, sessionId } = req.params;

      // Validate input
      if (!Number(skillTransferId) || !Number(sessionId)) {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Get student profile
      const studentProfile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, req.user.id))
        .then((results) => results[0]);

      if (!studentProfile) {
        res.status(404).json({ message: "Student profile not found" });
        return;
      }

      // Check if user is the student for this skill transfer
      const transfer = await db
        .select()
        .from(skillTransfers)
        .where(eq(skillTransfers.id, Number(skillTransferId)))
        .then((results) => results[0]);

      if (!transfer) {
        res.status(404).json({ message: "Skill transfer not found" });
        return;
      }

      if (transfer.studentId !== studentProfile.id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      // Get session details to check cost
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, Number(sessionId)))
        .then((results) => results[0]);

      if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
      }

      const sessionCost = session.points;
      if (studentProfile.points < sessionCost) {
        res.status(400).json({ message: "Insufficient points" });
        return;
      }

      // Update student points
      await db
        .update(studentProfiles)
        .set({ points: studentProfile.points - sessionCost })
        .where(eq(studentProfiles.id, studentProfile.id));

      // Update the session to mark it as paid
      await db
        .update(sessions)
        .set({ paid: true })
        .where(
          and(
            eq(sessions.id, Number(sessionId)),
            eq(sessions.skillTransferId, Number(skillTransferId))
          )
        );

      // Check if all sessions are completed and paid
      await SkillTransfersController.checkAndUpdateTransferStatus(
        Number(skillTransferId)
      );

      res.status(200).json({ message: "Session marked as paid" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
