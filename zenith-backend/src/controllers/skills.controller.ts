import { Request, Response } from "express";
import { db } from "../db";
import { skills, studentSkills } from "../models";
import { eq } from "drizzle-orm";
import { StudentSkillTypeType } from "../models/studentSkill.model";
import { SkillViewModel } from "../viewmodels/skill/skill.viewmodel";
import { SkillCategoryViewModel } from "../viewmodels/skill/skillCategory.viewmodel";
import { StudentSkillViewModel } from "../viewmodels/skill/studentSkill.viewmodel";
import { ErrorViewModel } from "../viewmodels/error.viewmodel";

export class SkillsController {
  static async getAllSkills(req: Request, res: Response) {
    try {
      const allSkills = await db.select().from(skills);

      const viewModels = allSkills.map((skill) => new SkillViewModel(skill));
      res.json(viewModels);
    } catch (error) {
      res
        .status(500)
        .json(
          ErrorViewModel.internalError("Failed to retrieve skills").toJSON()
        );
    }
  }

  static async updateStudentSkills(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { skills } = req.body;

      // Delete existing skills for the student
      await db
        .delete(studentSkills)
        .where(eq(studentSkills.studentId, parseInt(studentId)));

      // Insert new skills
      const newSkills = skills.map(
        (skill: {
          skillId: number;
          type: StudentSkillTypeType;
          points: number;
          description: string;
        }) => ({
          studentId: parseInt(studentId),
          skillId: skill.skillId,
          type: skill.type,
          points: skill.points,
          description: skill.description,
        })
      );

      await db.insert(studentSkills).values(newSkills);

      // Fetch updated skills
      const updatedSkills = await db
        .select()
        .from(studentSkills)
        .where(eq(studentSkills.studentId, parseInt(studentId)));

      const viewModels = updatedSkills.map(
        (skill) => new StudentSkillViewModel(skill)
      );
      res.json(viewModels);
    } catch (error) {
      res
        .status(500)
        .json(
          ErrorViewModel.internalError(
            "Failed to update student skills"
          ).toJSON()
        );
    }
  }
}
