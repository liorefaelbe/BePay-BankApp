import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/web-bank";

// Function to connect to MongoDB
export async function connectDB() {
  try {
    console.log("🔌 Attempting to connect to MongoDB...");

    // Hide sensitive info in logs
    const safeUri = MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
    console.log("📍 URI:", safeUri);

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully");
    console.log("📦 Database:", mongoose.connection.db?.databaseName);
    console.log("🌍 Host:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);

    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        console.error("💡 Check your username and password in MONGO_URI");
      } else if (error.message.includes("network")) {
        console.error("💡 Check Network Access settings in MongoDB Atlas");
        console.error(
          "💡 Make sure your IP is whitelisted (0.0.0.0/0 or current IP)"
        );
      }
    }

    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("👋 MongoDB connection closed through app termination");
  process.exit(0);
});
