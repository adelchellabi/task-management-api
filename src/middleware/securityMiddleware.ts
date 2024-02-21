import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

const allowedOrigins = ["http://localhost"];

function setSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  helmet()(req, res, next);
}

function handleCors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string;
  if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
}

function setRateLimit(req: Request, res: Response, next: NextFunction) {
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message:
      "Too many requests created from this IP, please try again after 5 minutes",
  })(req, res, next);
}

export function setupSecurityMiddleware(app: express.Application): void {
  app.use(setSecurityHeaders);
  app.use(handleCors);
  app.use(setRateLimit);
}

export function routeNotFoundErrorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path === "/") return res.redirect("/api/v1/api-docs");
  res.status(StatusCodes.NOT_FOUND).json({ error: "Route not found" });
}
