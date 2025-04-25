import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { requireStudentRole } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Get all skill categories
router.get(
  "/categories",
  authMiddleware,
  requireStudentRole,
  SkillsController.getCategories
);

// Get skills by category ID
router.get(
  "/categories/:categoryId/skills",
  authMiddleware,
  requireStudentRole,
  SkillsController.getSkillsByCategory
);

// Update student skills
router.put(
  "/students/:studentId/skills",
  authMiddleware,
  requireStudentRole,
  SkillsController.updateStudentSkills
);

export default router;
