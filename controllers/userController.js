import User from "../models/userModel.js";
import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";
dotenv.config();

export async function createUser(req, res) {
  try {
    const { userId, fullName, email, accountCreated, lastSignIn } = req.body;
    if (!userId || !fullName || !email || !accountCreated || !lastSignIn) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "Missing required fields",
      });
    }

    if (await User.findOne({ userId })) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
        error: "User already exists",
      });
    }

    const user = new User({
      userId,
      fullName,
      email,
      accountCreated: new Date(accountCreated),
      lastSignIn: new Date(lastSignIn),
    });

    const result = await user.save();
    res.status(201).json({
      success: true,
      message: "User created",
      data: { userId: result._id },
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Internal server error",
    });
  }
}

export async function authUser(req, res) {
  try {
    const { token, userId } = req.body;
    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing token or userId",
        error: "Missing token or userId",
      });
    }
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (payload.sub !== userId) {
        return res.status(401).json({
          success: false,
          message: "Invalid token or userId",
          error: "Invalid token or userId",
        });
      }

      res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: { userId },
      });
    } catch (err) {
      console.error("Auth error (invalid token):", err);
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: "Invalid token",
      });
    }
  } catch (err) {
    console.error("Error in authUser:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Internal server error",
    });
  }
}
