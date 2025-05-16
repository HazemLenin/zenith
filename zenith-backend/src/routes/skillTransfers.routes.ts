import { Router } from "express";
import { SkillTransfersController } from "../controllers/skillTransfers.controller";
import { studentMiddleware } from "../middleware/student.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/request",  SkillTransfersController.requestSkillTransfer);

router.get("/teachers-search", SkillTransfersController.getTeachersSearch);

router.get("/my-requests", authMiddleware, SkillTransfersController.getMyRequests);

router.get("/my-skill-transfers", authMiddleware, SkillTransfersController.getMySkillTransfers);

router.get("/transfer-details/:skillTransferId", SkillTransfersController.getTransferDetails);

router.put("/accept/:skillTransferId", SkillTransfersController.acceptRequest);

router.delete("/reject/:skillTransferId", SkillTransfersController.rejectRequest);

router.put("/:skillTransferId/complete-session/:sessionId", SkillTransfersController.completeSession);

router.put("/:skillTransferId/pay-session/:sessionId", SkillTransfersController.paySession);

export default router;