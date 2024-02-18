import mongoose from "mongoose";
import Logger from "./logger";

export default async function connectDB() {
  const url =
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI_DEV;

  if (!url)
    throw new Error(
      "MongoDB URI not found in environment variables. Please make sur to set it."
    );

  try {
    await mongoose.connect(url, { autoIndex: true });
    Logger.info(`Database connected: ${url}`);
  } catch (err) {
    Logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}
