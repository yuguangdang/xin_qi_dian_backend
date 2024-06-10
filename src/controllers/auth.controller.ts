// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User";
import { Student } from "../models/Student";
import { Tutor } from "../models/Tutor";

// Function to register a new user
export const register = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { email, password, role, name } = req.body;

    const user = new User({
      email,
      password: password,
      role,
    });

    await user.save({ session });

    let profile;
    if (role === "student") {
      profile = new Student({ userId: user._id, name: name});
    } else if (role === "tutor") {
      profile = new Tutor({ userId: user._id });
    } else {
      throw new Error("Invalid role specified");
    }

    await profile.save({ session });
    user.profileId = profile._id;
    await user.save({ session });

    await session.commitTransaction();
    res
      .status(201)
      .send({
        message: "User and profile created successfully",
        user,
        profile,
      });
  } catch (error: any) {
    await session.abortTransaction();

    // Pattern matching on error message for duplicate key
    if (error.message.includes("duplicate key error collection")) {
      return res
        .status(400)
        .send({
          message: "Email already exists. Please use a different email.",
        });
    }

    res
      .status(500)
      .send({ message: "Registration failed", error: error.message });
  } finally {
    session.endSession();
  }
};

// Function to login a user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    // Generate a token
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
    res.send({ user, token });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
};

// Function to logout a user
export const logout = async (req: Request, res: Response) => {
  // Assuming you have a way to mark the token as invalid in your database
  try {
    // You would need to send the token from the client to perform this action
    const { token } = req.body;
    // Here you would mark the token as invalid, for example:
    // await invalidateToken(token); // This is a hypothetical function
    res.send({ message: "User logged out successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: "Failed to log out." });
  }
};

// Function to delete a user and their associated profile
export const deleteUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { userId } = req.params;

    // Find the user and their role
    const user = await User.findById(userId).session(session);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Delete the associated profile based on role
    if (user.role === "student") {
      await Student.findOneAndDelete(user.profileId).session(session);
    } else if (user.role === "tutor") {
      await Tutor.findOneAndDelete(user.profileId).session(session);
    }

    // Now delete the user
    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();
    res.send({ message: "User and their profile deleted successfully" });
  } catch (error: any) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).send({ error: "Failed to delete user." });
  } finally {
    session.endSession();
  }
};
