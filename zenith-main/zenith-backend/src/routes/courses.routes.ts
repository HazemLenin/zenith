import { Router } from "express";
import { CoursesController } from "../controllers/courses.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { instructorMiddleware } from "../middleware/instructor.middleware";

const router = Router();

// Course routes
router.post("/", instructorMiddleware, CoursesController.uploadCourse);
router.get("/", authMiddleware, CoursesController.getCourses);
router.get("/my-courses", instructorMiddleware, CoursesController.getMyCourses);
router.get("/:id", authMiddleware, CoursesController.getCourseDetails);
router.get(
  "/:id/chapters",
  authMiddleware,
  CoursesController.getCourseChapters
);
router.get(
  "/:courseId/chapters/:chapterId",
  authMiddleware,
  CoursesController.getChapterDetails
);
router.post("/enroll", authMiddleware, CoursesController.enrollStudent);
router.get(
  "/courses/:courseId/certificate",
  authMiddleware,
  CoursesController.generateCertificate
);

export default router;
