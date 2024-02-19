import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class AccessDeniedError extends BaseError {
  constructor(
    message: string = "Access denied. You do not have permission to access this resource."
  ) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = "AccessDeniedError";
  }
}
