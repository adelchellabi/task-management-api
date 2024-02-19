import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
  details: any;

  constructor(message: string, details: any) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = "ValidationError";
    this.details = details;
  }
}
