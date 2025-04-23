import { Request, Response } from "express";
import { db } from "../db/db";
import { users, UserRole } from "../models/user.model";
import { eq } from "drizzle-orm";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;
    // const newUser = await db.insert(users).values({
    //   firstName,
    //   lastName,
    //   username,
    //   email,
    //   password,
    //   role: role || UserRole.STUDENT,
    // });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)));
    if (user.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email, password, role } = req.body;
    // const updatedUser = await db
    //   .update(users)
    //   .set({
    //     firstName,
    //     lastName,
    //     username,
    //     email,
    //     password,
    //     role,
    //   })
    //   .where(eq(users.id, parseInt(id)));
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await db.delete(users).where(eq(users.id, parseInt(id)));
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
