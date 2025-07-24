import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountCreated: { type: Date, required: true },
  lastSignIn: { type: Date, required: true },
  friends: [{ type: String }],
});

const User = mongoose.model("User", userSchema);

export default User;
