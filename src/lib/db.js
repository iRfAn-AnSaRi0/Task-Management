import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in .env.local");
}

export const connectDB = async () => {
  // Check if MongoDB is already connected
  if (mongoose.connection.readyState >= 1) {
    console.log("Database already connected");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
      bufferCommands: false, // Disable command buffering
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw new Error("Failed to connect to MongoDB");
  }
};
