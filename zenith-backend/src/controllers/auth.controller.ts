import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../index";
import { users, UserRole, UserRoleType, User } from "../models/user.model";
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
} from "../viewmodels/auth.viewmodel";
import { instructorProfiles } from "../models/instructorProfile.model";
import { studentProfiles } from "../models/studentProfile.model";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        role = "student",
      } = req.body;

      // Validate role
      if (role && role !== "student" && role !== "instructor") {
        res
          .status(400)
          .json({ message: "Role must be either 'student' or 'instructor'" });
        return;
      }

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) =>
          or(eq(users.email, email), eq(users.username, username)),
      });

      if (existingUser) {
        const duplicatedField =
          existingUser.email === email ? "email" : "username";
        res.status(400).json({
          message: `A user with this ${duplicatedField} already exists`,
        });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Start a transaction
      const result = await db.transaction(async (tx) => {
        // Create user
        const [newUser] = await tx
          .insert(users)
          .values({
            firstName,
            lastName,
            username,
            email,
            passwordHash,
            role: role as UserRoleType,
          } as any)
          .returning();

        // Create profile based on role
        if (role === "instructor") {
          const [instructorProfile] = await tx
            .insert(instructorProfiles)
            .values({
              userId: newUser.id,
              coursesCount: 0,
            })
            .returning();

          // Update user with instructor profile ID
          await tx
            .update(users)
            .set({ instructorProfileId: instructorProfile.id } as any)
            .where(eq(users.id, newUser.id));
        } else {
          const [studentProfile] = await tx
            .insert(studentProfiles)
            .values({
              userId: newUser.id,
              points: 0,
            })
            .returning();

          // Update user with student profile ID
          await tx
            .update(users)
            .set({ studentProfileId: studentProfile.id } as any)
            .where(eq(users.id, newUser.id));
        }

        return newUser;
      });

      // Generate token
      const token = jwt.sign({ id: result.id }, JWT_SECRET);

      const response: AuthResponse = {
        token,
        user: {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          username: result.username,
          email: result.email,
          role: result.role,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET
      );

      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
