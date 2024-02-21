import express from "express";
import "./config/dotenv";
import connectDB from "./config/db";
import morganMiddleware from "./middleware/morganMiddleware";
import {
  setupSecurityMiddleware,
  routeNotFoundErrorMiddleware,
} from "./middleware/securityMiddleware";
import routes from "./routes";

const app = express();

setupSecurityMiddleware(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganMiddleware);

connectDB();

app.use("/api/v1", routes);
app.use(routeNotFoundErrorMiddleware);

export default app;
