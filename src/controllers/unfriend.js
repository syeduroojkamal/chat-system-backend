import User from "../models/userModel.js";

export default async function unfriend(myUserId, friendId) {
  if (!myUserId || !friendId) {
    return {
      success: false,
      message: "missing field(s) myUserId or friendId",
    };
  }

  try {
    const user = await User.findOne({ userId: myUserId });
    if (!user) throw new Error("User not found");

    user.friends = user.friends.filter((id) => id !== friendId);
    await user.save();

    return {
      success: true,
      message: "unfriend successful",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "server error in unfriend",
    };
  }
}
