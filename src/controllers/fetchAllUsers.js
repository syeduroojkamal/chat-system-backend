import User from "../models/userModel.js";

export default async function fetchAllUsers({
  userId,
  fullName,
  email,
  accountCreated,
  lastSignIn,
}) {
  try {
    // Fetch all users except the one with the given userId
    const allUsers = await User.find({ userId: { $ne: userId } });
    return {
      success: true,
      message: "Users fetched successfully",
      data: allUsers,
    };
  } catch (err) {
    console.error("Error in fetchAllUsers:", err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
