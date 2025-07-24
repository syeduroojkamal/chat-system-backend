import User from "../models/userModel.js";

export default async function initUser({
  userId,
  fullName,
  email,
  accountCreated,
  lastSignIn,
}) {
  if (!userId || !fullName || !email || !accountCreated || !lastSignIn) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }

  const existingUser = await User.findOne({ userId });
  if (existingUser) {
    existingUser.lastSignIn = new Date();
    return {
      success: true,
      message: "User found",
      data: existingUser,
    };
  }

  try {
    const user = new User({
      userId,
      fullName,
      email,
      accountCreated: new Date(accountCreated),
      lastSignIn: new Date(lastSignIn),
      friends: [],
    });

    const result = await user.save();
    return {
      success: true,
      message: "User created",
      data: result,
    };
  } catch (err) {
    console.error("Error in createUser:", err);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
