import mongoose from "mongoose";

// CRITICAL: fail fast, don't hang if MongoDB is offline or unconfigured
mongoose.set("bufferCommands", false);

let isConnected = false;

const connectToDatabase = async (): Promise<boolean> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return true;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return false;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log("Connected to MongoDB database");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed — in-memory mock store active:", error);
    return false;
  }
};

export default connectToDatabase;
