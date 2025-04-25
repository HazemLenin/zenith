import { Request, Response } from "express";
import { db } from "../index";
import { users } from "../models/user.model";
import { instructorProfiles } from "../models/instructorProfile.model";
import { studentProfiles } from "../models/studentProfile.model";
import { studentSkills } from "../models/studentSkill.model";
import {
  StudentProfileResponse,
  InstructorProfileResponse,
} from "../viewmodels/user.viewmodel";
import { eq } from "drizzle-orm";

export class UsersController {
  static async getUserByUsername(
    req: Request<{ username: string }>,
    res: Response
  ): Promise<void> {
    try {
      const username = req.params.username;

      // Get user with profile
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
        with: {
          student: true,
          instructor: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.role === "student" && user.student) {
        // Get student skills
        const skills = await db
          .select()
          .from(studentSkills)
          .where(eq(studentSkills.studentId, user.student.id));

        const response: StudentProfileResponse = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          profile: {
            id: user.student.id,
            points: (user.student as any).points,
            skills: skills.map((skill) => ({
              id: skill.id,
              skillId: skill.skillId,
              type: skill.type,
            })),
          },
        };
        res.json(response);
      } else if (user.role === "instructor" && user.instructor) {
        const response: InstructorProfileResponse = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          profile: {
            id: user.instructor.id,
            coursesCount: (user.instructor as any).coursesCount,
          },
        };
        res.json(response);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
