import { Router } from "express";
import { SkillTransfersController } from "../controllers/skillTransfers.controller";
import { studentMiddleware } from "../middleware/student.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/request",
  authMiddleware,
  SkillTransfersController.requestSkillTransfer
);

router.get(
  "/teachers-search",
  authMiddleware,
  SkillTransfersController.getTeachersSearch
);

router.get(
  "/my-requests",
  authMiddleware,
  SkillTransfersController.getMyRequests
);

router.get(
  "/my-skill-transfers",
  authMiddleware,
  SkillTransfersController.getMySkillTransfers
);

router.get(
  "/transfer-details/:skillTransferId",
  authMiddleware,
  SkillTransfersController.getTransferDetails
);

router.put(
  "/accept/:skillTransferId",
  authMiddleware,
  SkillTransfersController.acceptRequest
);

router.delete(
  "/reject/:skillTransferId",
  authMiddleware,
  SkillTransfersController.rejectRequest
);

router.put(
  "/:skillTransferId/complete-session/:sessionId",
  authMiddleware,
  SkillTransfersController.completeSession
);

router.put(
  "/:skillTransferId/pay-session/:sessionId",
  authMiddleware,
  SkillTransfersController.paySession
);

export default router;
