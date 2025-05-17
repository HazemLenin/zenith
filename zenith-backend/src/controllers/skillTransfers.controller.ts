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

      // Create a new skill transfer request
      const newRequest = {
        studentId: req.user.id,
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

      // Validate input
      if (typeof skillId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Fetch teachers who can teach the specified skill
      const teachers = await db
        .select()
        .from(studentSkills)
        .innerJoin(users, eq(studentSkills.id, skillId))
        .where(
          and(
            eq(studentSkills.id, skillId),
            eq(studentSkills.type, StudentSkillType.LEARNED)
          )
        )
        .then((results) => {
          return results.map((result) => ({
            teacherId: result.users.id,
            points: result.student_skills.points,
            teacherFirstName: result.users.firstName,
            teacherLastName: result.users.lastName,
            description: result.student_skills.description,
          }));
        });

      res.status(200).json(teachers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMyRequests(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = req.user.id; // Assuming the student ID is stored in req.user

      // Validate input
      if (typeof teacherId != "number") {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Fetch skill transfer requests for the student, ordered by newest first
      const requests = await db
        .select({
          studentFirstname: users.firstName,
          studentLastname: users.lastName,
          skillId: skillTransfers.skillId,
          skillTitle: skills.title,
          skillPoints: skillTransfers.points,
        })
        .from(skillTransfers)
        .innerJoin(users, eq(skillTransfers.studentId, users.id))
        .innerJoin(skills, eq(skillTransfers.skillId, skills.id))
        .where(
          and(
            eq(skillTransfers.teacherId, teacherId),
            eq(skillTransfers.status, "pending")
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
        .set({ [skillTransfers.status.name]: SkillTransferStatus.IN_PROGRESS })
        .where(eq(skillTransfers.id, skillTransferId));

      res.status(200).json({ message: "Skill transfer request accepted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMySkillTransfers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const type = req.body.type;

      // Validate input
      if (typeof userId != "number" || !type) {
        res.status(400).json({ message: "Invalid input" });
        return;
      }

      // Build query with all conditions at once
      const transfers = await db
        .select()
        .from(skillTransfers)
        .innerJoin(users, eq(skillTransfers.studentId, users.id))
        .where(
          and(
            eq(skillTransfers.status, "in_progress"),
            type === StudentSkillType.LEARNED
              ? eq(skillTransfers.studentId, userId)
              : eq(skillTransfers.teacherId, userId)
          )
        )
        .then(async (results) => {
          return await Promise.all(
            results.map(async (result) => {
              const sessionsCount = await db
                .select({ count: count(sessions.id) })
                .from(sessions)
                .where(eq(sessions.skillTransferId, result.skill_transfers.id));
              const completedSessionsCount = await db
                .select({ count: count(sessions.id) })
                .from(sessions)
                .where(
                  and(
                    eq(sessions.skillTransferId, result.skill_transfers.id),
                    eq(sessions.completed, true)
                  )
                );
              const paidSessionsCount = await db
                .select({ count: count(sessions.id) })
                .from(sessions)
                .where(
                  and(
                    eq(sessions.skillTransferId, result.skill_transfers.id),
                    eq(sessions.paid, true)
                  )
                );

              return {
                id: result.skill_transfers.id,
                studentFirstname: result.users.firstName,
                studentLastname: result.users.lastName,
                sessions: sessionsCount[0]["count"],
                completedSessions: completedSessionsCount[0]["count"],
                points: result.skill_transfers.points,
                paid: paidSessionsCount[0]["count"],
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
        .innerJoin(users, eq(skillTransfers.studentId, users.id))
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

          const teacherFirstName = await db
            .select({ firstName: users.firstName })
            .from(users)
            .where(eq(users.id, result.skill_transfers.teacherId))
            .then((results) => results[0]?.firstName);
          const teacherLastName = await db
            .select({ lastName: users.lastName })
            .from(users)
            .where(eq(users.id, result.skill_transfers.teacherId))
            .then((results) => results[0]?.lastName);
          const sessionCount = sessionsList.length;
          const completedSessionsCount = sessionsList.filter(
            (session) => session.completed
          ).length;

          return {
            skillTitle: result.skills.title,
            teacherFirstName: teacherFirstName,
            teacherLastName: teacherLastName,
            studentFirstName: result.users.firstName,
            studentLastName: result.users.lastName,
            points: result.skill_transfers.points,
            sessionCount,
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

  static async completeSession(req: Request, res: Response): Promise<void> {
    try {
      const { skillTransferId, sessionId } = req.params;
      // Validate input
      if (!Number(skillTransferId) || !Number(sessionId)) {
        res.status(400).json({ message: "Invalid input" });
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

      if (transfer.teacherId !== req.user.id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      // Update the session to mark it as completed
      await db
        .update(sessions)
        .set({ [sessions.completed.name]: true })
        .where(
          and(
            eq(sessions.id, Number(sessionId)),
            eq(sessions.skillTransferId, Number(skillTransferId))
          )
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

      if (transfer.studentId !== req.user.id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      // Get student profile to check points
      const studentProfile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, req.user.id))
        .then((results) => results[0]);

      if (!studentProfile) {
        res.status(404).json({ message: "Student profile not found" });
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
        .where(eq(studentProfiles.userId, req.user.id));

      // Update the session to mark it as paid
      await db
        .update(sessions)
        .set({ [sessions.paid.name]: true })
        .where(
          and(
            eq(sessions.id, Number(sessionId)),
            eq(sessions.skillTransferId, Number(skillTransferId))
          )
        );

      res.status(200).json({ message: "Session marked as paid" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
