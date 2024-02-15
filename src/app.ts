import express, { Request, Response } from "express";
import "./config/dotenv";
import connectDB from "./config/db";
import morganMiddleware from "./config/morganMiddleware";
import { setupSecurityMiddleware } from "./middleware/securityMiddleware";

const app = express();

setupSecurityMiddleware(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

connectDB();

export default app;
