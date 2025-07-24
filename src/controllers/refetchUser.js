import User from "../models/userModel.js";

export default async function refetchUser(userId) {
  if (!userId) {
    return {
      success: false,
      message: "Missing userId for refetchUser",
    };
  }
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      existingUser.lastSignIn = new Date();
      return {
        success: true,
        message: "User found",
        data: existingUser,
      };
    }
  } catch (error) {
    console.error("Error in refetchUser:", err);
    return {
      success: false,
      message: "Server error in refetchUser",
    };
  }
}
