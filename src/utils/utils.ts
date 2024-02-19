import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { TokenUserData } from "../middleware/authMiddleware";

export function generateToken(
  payload: TokenUserData,
  expiresIn = "1h"
): string {
  return jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn });
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}
