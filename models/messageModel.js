import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    index: true,
  },
  message: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true }, // can be helpful when used in groups (easy sender identification).
  receiverId: { type: String, default: null }, // null in case message is on a group
  roomId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
