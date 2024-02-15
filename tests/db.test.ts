import mongoose from "mongoose";
import connectDB from "../src/config/db";

describe("Database Connection", () => {
  it("should connect to the test database", async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toEqual(1);
  });
});
