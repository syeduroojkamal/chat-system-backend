import messageModel from "../models/messageModel.js";

export default async function fetchMessages(userA, userB) {
  try {
    await messageModel.updateMany(
      { senderId: userB.userId, receiverId: userA.userId, read: false },
      { $set: { read: true } }
    );

    const messages = await messageModel
      .find({
        $or: [
          { senderId: userA.userId, receiverId: userB.userId },
          { senderId: userB.userId, receiverId: userA.userId },
        ],
      })
      .sort({ timestamp: 1 }); // Sort by time ascending
    return {
      success: true,
      message: "Found Chat Between Users",
      data: messages,
    };
  } catch (error) {
    console.error("Error in fetchMessages:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
