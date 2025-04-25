import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { instructorProfiles } from "../models";
import { eq } from "drizzle-orm";

// Extend Express Request type to include user
declare module "express" {
  interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}

export const instructorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res
        .status(401)
        .json({ message: "Unauthorized. User not authenticated." });
      return;
    }

    const instructor = await db
      .select()
      .from(instructorProfiles)
      .where(eq(instructorProfiles.userId, userId))
      .limit(1);

    if (!instructor.length) {
      res
        .status(403)
        .json({ message: "Access denied. User is not an instructor." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in instructor middleware:", error);
    res.status(500).json({ message: "Error verifying instructor status" });
  }
};
