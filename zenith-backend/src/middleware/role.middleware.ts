import { Request, Response, NextFunction } from "express";
import { db } from "../index";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";

export const requireStudentRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user ID from the authenticated user (assuming it's stored in req.user)
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role !== "student") {
      res
        .status(403)
        .json({ message: "Access denied. Student role required." });
      return;
    }

    // Add user to request for later use
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Role middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
