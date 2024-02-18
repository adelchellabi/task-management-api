import { ResourceNotFoundError } from "../src/exceptions/RessourceNotFoundError";
import { ResourceAlreadyExistsError } from "../src/exceptions/RessourceAlreadyExistsError";
import { StatusCodes } from "http-status-codes";

describe("ResourceNotFoundError", () => {
  it("should create an instance with correct error message and status code", () => {
    const errorMessage = "Custom not found message";
    const error = new ResourceNotFoundError(errorMessage);

    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe("ResourceNotFoundError");
    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  it("should create an instance with default error message and status code", () => {
    const error = new ResourceNotFoundError();

    expect(error.message).toBe("Resource not found");
    expect(error.name).toBe("ResourceNotFoundError");
    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe("ResourceAlreadyExistsError", () => {
  it("should create an instance with correct error message and status code", () => {
    const errorMessage = "Custom already exists message";
    const error = new ResourceAlreadyExistsError(errorMessage);

    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe("ResourceAlreadyExistsError");
    expect(error.statusCode).toBe(StatusCodes.CONFLICT);
  });

  it("should create an instance with default error message and status code", () => {
    const error = new ResourceAlreadyExistsError();

    expect(error.message).toBe("Resource already exists");
    expect(error.name).toBe("ResourceAlreadyExistsError");
    expect(error.statusCode).toBe(StatusCodes.CONFLICT);
  });
});
