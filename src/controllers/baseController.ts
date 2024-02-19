import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import Logger from "../config/logger";
import { ValidationError } from "../exceptions/ValidationError";
import { BaseError } from "../exceptions/BaseError";

export class BaseController {
  protected handleRequestError = (error: any, res: Response) => {
    Logger.error("Error occurred:", error);

    const { statusCode, errorMessage, details } = this.getErrorDetails(error);

    res.status(statusCode).json({ error: errorMessage, details });
  };

  private getErrorDetails(error: any): {
    statusCode: number;
    errorMessage: string;
    details?: any;
  } {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let errorMessage = "Internal server error";
    let details;

    switch (true) {
      case error instanceof ValidationError:
        statusCode = error.statusCode;
        errorMessage = error.message;
        details = error.details;
        break;
      case error instanceof BaseError:
        statusCode = error.statusCode;
        errorMessage = error.message;
        break;
    }

    return { statusCode, errorMessage, details };
  }
}
