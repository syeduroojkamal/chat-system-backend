import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Mongoose connected to MongoDB");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

export default connectDB;
