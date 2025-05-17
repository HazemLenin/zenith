import { Request, Response, NextFunction } from "express";
import { db } from "../index";
import { instructorProfiles } from "../models";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { users } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extend Express Request type to include user

export const instructorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First run authentication check
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
      columns: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Then check if user is an instructor
    const instructor = await db
      .select()
      .from(instructorProfiles)
      .where(eq(instructorProfiles.userId, user.id))
      .limit(1);

    if (!instructor.length) {
      res
        .status(403)
        .json({ message: "Access denied. User is not an instructor." });
      return;
    }

    // Add user to request for later use
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in instructor middleware:", error);
    res.status(500).json({ message: "Error verifying instructor status" });
  }
};
