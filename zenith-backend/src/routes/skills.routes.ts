import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { studentMiddleware } from "../middleware/student.middleware";

const router = Router();

// Get all skill categories
router.get("/categories", studentMiddleware, SkillsController.getCategories);

// Get skills by category ID
router.get(
  "/categories/:categoryId/skills",
  studentMiddleware,
  SkillsController.getSkillsByCategory
);

// Update student skills
router.put(
  "/students/:studentId/skills",
  studentMiddleware,
  SkillsController.updateStudentSkills
);

export default router;
