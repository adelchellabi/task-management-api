import express from "express";
import "./config/dotenv";
import connectDB from "./config/db";
import morganMiddleware from "./config/morganMiddleware";
import { setupSecurityMiddleware } from "./middleware/securityMiddleware";
import routes from "./routes";
const app = express();

setupSecurityMiddleware(app);

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1", routes);

export default app;
