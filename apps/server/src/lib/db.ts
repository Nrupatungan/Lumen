import mongoose from "mongoose";
import "dotenv/config";

let isConnected = false; // Prevent multiple connections in dev

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB: already connected");
    return;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || "lumen",
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
    process.exit(1);
  }
}
