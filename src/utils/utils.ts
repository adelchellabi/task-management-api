import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { TokenUserData } from "../middleware/authMiddleware";
import { BaseError } from "../exceptions/BaseError";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "../exceptions/ValidationError";

export function generateToken(
  payload: TokenUserData,
  expiresIn = "1h"
): string {
  return jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn });
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export const getErrorDetails = (
  error: any
): {
  statusCode: number;
  errorMessage: string;
  details?: any;
} => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let errorMessage = "Internal Server Error";
  let details;

  switch (true) {
    case error instanceof ValidationError:
      statusCode = error.statusCode;
      errorMessage = error.message;
      details = error.details;
      break;
    case error instanceof BaseError:
      statusCode = error.statusCode;
      errorMessage = error.message;
      break;
  }

  return { statusCode, errorMessage, details };
};
