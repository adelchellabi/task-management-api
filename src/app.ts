import mongoose from "mongoose";
import express, { Request, Response } from "express";
import "./config/dotenv";
import connectDB from "./config/db";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.json("Hello World!");
});

app.get("/checkdb", async (req, res) => {
  try {
    res.status(200).json({ connected: mongoose.connection.readyState === 1 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
