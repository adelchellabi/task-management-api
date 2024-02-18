import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationError } from "../exceptions/ValidationError";

export const handleDtoValidation = async <T extends object>(
  body: any,
  dtoClass: ClassConstructor<T>
): Promise<T> => {
  const dtoObject = plainToClass(dtoClass, body);

  const errors = await validate(dtoObject);

  if (errors.length > 0) {
    const validationErrors = errors.map((error) =>
      error.constraints ? Object.values(error.constraints) : []
    );

    throw new ValidationError("Validation error", validationErrors);
  }
  return dtoObject;
};
