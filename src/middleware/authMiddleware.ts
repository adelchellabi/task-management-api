import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/user";
import { UnauthorizedError } from "../exceptions/UnauthorizedError";
import { AccessDeniedError } from "../exceptions/AccessDeniedError";
import { StatusCodes } from "http-status-codes";

export interface TokenUserData {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenUserData;
}

export function isAuthenticated(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Unauthorized. Please provide a token");
    }
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      (err: any, user: any) => {
        if (err) {
          throw new UnauthorizedError(
            "Unauthorized. The provided token has expired."
          );
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
}

export function authorizeRoles(roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
        throw new AccessDeniedError();
      }
      next();
    } catch (error: any) {
      if (error instanceof AccessDeniedError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal server error" });
      }
    }
  };
}
