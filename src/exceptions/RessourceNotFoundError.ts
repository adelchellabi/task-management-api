import { StatusCodes } from "http-status-codes";

export class ResourceNotFoundError extends Error {
  statusCode: number;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "ResourceNotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
