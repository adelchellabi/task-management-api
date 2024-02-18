import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import Logger from "../config/logger";
import { ResourceAlreadyExistsError } from "../exceptions/RessourceAlreadyExistsError";
import { ResourceNotFoundError } from "../exceptions/RessourceNotFoundError";
import { ValidationError } from "../exceptions/ValidationError";

export class BaseController {
  protected handleRequestError = (error: any, res: Response) => {
    Logger.error("Error occurred:", error);

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let errorMessage = "Internal server error";
    let details;
    switch (true) {
      case error instanceof ValidationError:
        statusCode = error.statusCode;
        errorMessage = error.message;
        details = error.details;
        break;
      case error instanceof ResourceAlreadyExistsError:
      case error instanceof ResourceNotFoundError:
        statusCode = error.statusCode;
        errorMessage = error.message;
        break;
    }

    res.status(statusCode).json({ error: errorMessage, details });
  };
}
