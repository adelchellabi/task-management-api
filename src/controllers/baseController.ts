import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import Logger from "../config/logger";
import { ValidationError } from "../exceptions/ValidationError";
import { BaseError } from "../exceptions/BaseError";
import { getErrorDetails } from "../utils/utils";

export class BaseController {
  protected handleRequestError = (error: any, res: Response) => {
    Logger.error("Error occurred:", error);

    const { statusCode, errorMessage, details } = getErrorDetails(error);

    res.status(statusCode).json({ error: errorMessage, details });
  };
}
