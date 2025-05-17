import { Request, Response, NextFunction } from "express";
import { db } from "../index";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const studentMiddleware = async (
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

    // Then check if user is a student
    if (user.role !== "student") {
      res
        .status(403)
        .json({ message: "Access denied. Student role required." });
      return;
    }

    // Add user to request for later use
    req.user = user;
    next();
  } catch (error) {
    console.error("Role middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
