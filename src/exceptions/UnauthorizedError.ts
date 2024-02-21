import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(
    message: string = "Unauthorized. The provided token is invalid or has expired."
  ) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}
