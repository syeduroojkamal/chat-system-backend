import Message from "../models/messageModel.js";

export default async function userToServerMessage({
  messageId,
  message,
  senderId,
  senderName,
  receiverId,
  roomId,
  timestamp,
  read,
}) {
  if (!message || !senderId || !senderName) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }
  try {
    const messageMongodb = new Message({
      message,
      senderId,
      senderName,
      receiverId,
      roomId,
      read,
    });

    const result = await messageMongodb.save();
    return {
      success: true,
      message: "Message saved",
      data: result,
    };
  } catch (error) {
    console.error("Error in userToServerMessage:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
