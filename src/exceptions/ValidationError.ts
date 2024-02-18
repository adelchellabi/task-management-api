import { StatusCodes } from "http-status-codes";

export class ValidationError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.details = details;
  }
}
