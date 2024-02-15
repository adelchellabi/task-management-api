import mongoose from "mongoose";

export default async function connectDB() {
  const url =
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI_DEV;
  console.log("url");

  if (!url)
    throw new Error(
      "MongoDB URI not found in environment variables. Please make sur to set it."
    );

  try {
    await mongoose.connect(url);
    console.log(`Database connected: ${url}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}
