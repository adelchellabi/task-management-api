import { StatusCodes } from "http-status-codes";

export class ResourceAlreadyExistsError extends Error {
  statusCode: number;

  constructor(message: string = "Resource already exists") {
    super(message);
    this.name = "ResourceAlreadyExistsError";
    this.statusCode = StatusCodes.CONFLICT;
  }
}
