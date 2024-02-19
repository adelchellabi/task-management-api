import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized") {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}
