import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { UsersController } from "../controllers/users.controller";

const router = Router();

router.get("/:username", authMiddleware, UsersController.getUserByUsername);

export default router;
