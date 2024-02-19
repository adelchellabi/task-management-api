import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class ResourceAlreadyExistsError extends BaseError {
  constructor(message: string = "Resource already exists") {
    super(message, StatusCodes.CONFLICT);
    this.name = "ResourceAlreadyExistsError";
  }
}
