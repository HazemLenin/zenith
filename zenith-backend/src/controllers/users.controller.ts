import { Request, Response } from "express";
import { db } from "../index";
import { users } from "../models/user.model";
import { studentSkills } from "../models/studentSkill.model";
import { eq } from "drizzle-orm";
import { StudentProfileResponse } from "../viewmodels/user/studentProfile.viewmodel";
import { InstructorProfileResponse } from "../viewmodels/user/instructorProfile.viewmodel";
import { ErrorViewModel } from "../viewmodels/error.viewmodel";
import { skills } from "../models";

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
        res
          .status(404)
          .json(ErrorViewModel.notFound("User not found").toJSON());
        return;
      }

      if (user.role === "student" && user.student) {
        // JOIN studentSkills with skill table
        const studentSkillsResult = await db
          .select({
            id: skills.id,
            title: skills.title,
            type: studentSkills.type,
            description: studentSkills.description,
            points: studentSkills.points,
          })
          .from(studentSkills)
          .innerJoin(skills, eq(studentSkills.skillId, skills.id)) // join on skillId
          .where(eq(studentSkills.studentId, user.student.id));

        // Now map them into your response!
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
            skills: studentSkillsResult,
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
            coursesCount: user.instructor.coursesCount,
          },
        };
        res.json(response);
      } else {
        res
          .status(404)
          .json(ErrorViewModel.notFound("User not found").toJSON());
      }
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json(ErrorViewModel.internalError().toJSON());
    }
  }
}
