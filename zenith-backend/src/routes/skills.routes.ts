import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { studentMiddleware } from "../middleware/student.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Get all skill categories
router.get(
  "/categories",
  authMiddleware,
  studentMiddleware,
  SkillsController.getCategories
);

// Get skills by category ID
router.get(
  "/categories/:categoryId/skills",
  authMiddleware,
  studentMiddleware,
  SkillsController.getSkillsByCategory
);

// Update student skills
router.put(
  "/students/:studentId/skills",
  authMiddleware,
  studentMiddleware,
  SkillsController.updateStudentSkills
);

export default router;
