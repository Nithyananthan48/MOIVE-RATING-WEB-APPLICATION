import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ENV } from "./env.js";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<string> {
  let uri = ENV.MONGO_URI;

  if (!uri) {
    console.log("No MONGO_URI provided in environment. Initializing in-memory MongoDB...");
    try {
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: "movieda" },
        spawn: { timeout: 60000 }
      });
      uri = memoryServer.getUri();
      console.log(`Connected to in-memory MongoDB instance: ${uri}`);
    } catch (err: any) {
      console.error("Failed to start in-memory MongoDB:", err.message);
      throw err;
    }
  } else {
    console.log("Connecting to provided MongoDB URI...");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connection established successfully.");
  return uri;
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
  } catch (err) {
    // Ignore cleanup errors
  }
}
