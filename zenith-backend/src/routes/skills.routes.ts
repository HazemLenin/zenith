import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { studentMiddleware } from "../middleware/student.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("", authMiddleware, SkillsController.getAllSkills);

// Update student skills
router.put(
  "/students/:studentId/skills",
  studentMiddleware,
  SkillsController.updateStudentSkills
);

export default router;
