import User from "../models/userModel.js";

export default async function addFriends(myUserId, userIds) {
  try {
    const user = await User.findOne({ userId: myUserId });
    if (!user) throw new Error("User not found");

    user.friends = Array.from(new Set([...user.friends, ...userIds]));
    await user.save();

    return { success: true, message: "addFriends successful" };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Server error in addFriends",
    };
  }
}
