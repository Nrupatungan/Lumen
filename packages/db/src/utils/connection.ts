import mongoose from "mongoose";

let isConnected = false; // Prevent multiple connections in dev

export async function connectDB(uri: string, dbName: string) {
  if (isConnected) {
    console.log("MongoDB: already connected");
    return;
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      dbName: dbName,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
  }
}
