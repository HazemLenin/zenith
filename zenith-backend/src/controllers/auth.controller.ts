import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../index";
import { users, UserRole, UserRoleType, User } from "../models/user.model";
import { AuthResponse } from "../viewmodels/auth/authResponse.viewmodel";
import { instructorProfiles } from "../models/instructorProfile.model";
import { studentProfiles } from "../models/studentProfile.model";
import { eq, InferInsertModel } from "drizzle-orm";
import { SignupRequest } from "../viewmodels/auth/signup.viewmodel";
import { LoginRequest } from "../viewmodels/auth/login.viewmodel";
import { ErrorViewModel } from "../viewmodels/error.viewmodel";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type NewUser = InferInsertModel<typeof users>;

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const signupRequest = req.body as SignupRequest;

      // Validate role
      if (
        signupRequest.role &&
        signupRequest.role !== "student" &&
        signupRequest.role !== "instructor"
      ) {
        res
          .status(400)
          .json(
            ErrorViewModel.validationError(
              "Role must be either 'student' or 'instructor'"
            ).toJSON()
          );
        return;
      }

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) =>
          or(
            eq(users.email, signupRequest.email),
            eq(users.username, signupRequest.username)
          ),
      });

      if (existingUser) {
        const duplicatedField =
          existingUser.email === signupRequest.email ? "email" : "username";
        res
          .status(400)
          .json(
            ErrorViewModel.validationError(
              `A user with this ${duplicatedField} already exists`
            ).toJSON()
          );
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(signupRequest.password, salt);

      // Start a transaction
      const result = await db.transaction(async (tx) => {
        // Create user
        const [newUser] = await tx
          .insert(users)
          .values({
            ...signupRequest,
            passwordHash,
            role: signupRequest.role as UserRoleType,
          } as NewUser)
          .returning();

        // Create profile based on role
        if (signupRequest.role === "instructor") {
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
              points: 100, // User default balance is 100
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
      const token = jwt.sign(
        {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          username: result.username,
          email: result.email,
          role: result.role,
        },
        JWT_SECRET
      );

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
      res.status(500).json(ErrorViewModel.internalError().toJSON());
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginRequest = req.body as LoginRequest;

      // Find user
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, loginRequest.email),
      });

      if (!user) {
        res
          .status(401)
          .json(ErrorViewModel.unauthorized("Invalid credentials").toJSON());
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginRequest.password,
        user.passwordHash
      );
      if (!isPasswordValid) {
        res
          .status(401)
          .json(ErrorViewModel.unauthorized("Invalid credentials").toJSON());
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
      res.status(500).json(ErrorViewModel.internalError().toJSON());
    }
  }
}
