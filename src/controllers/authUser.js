import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "@clerk/backend";

export default async function authUser({ token, userId }) {
  if (!token || !userId) {
    return {
      success: false,
      message: "Missing token or userId",
    };
  }
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (payload.sub !== userId) {
      return {
        success: false,
        message: "Invalid token or userId", // todo remove this userId
      };
    }

    return {
      success: true,
      message: "Authentication successful",
      data: { userId },
    };
  } catch (err) {
    console.error("Auth error (invalid token):", err);
    return {
      success: false,
      message: "Invalid token",
    };
  }
}
