import { IsNotEmpty, IsString, Length } from "class-validator";
import { handleDtoValidation } from "../../src/dtos/helper";

describe("handleDtoValidation function", () => {
  it("should handle DTO validation and return DTO object if validation succeeds", async () => {
    class TestClass {
      @IsString()
      value!: string;
    }
    const dtoObject = await handleDtoValidation({ value: "value" }, TestClass);

    expect(dtoObject.value).toBe("value");
  });

  it("should throw validation errors if validation fails", async () => {
    const data = {
      title: 55,
      description: "t",
    };

    class TestClass {
      @IsString()
      @IsNotEmpty()
      title!: string;

      @IsString()
      @IsNotEmpty()
      @Length(3)
      description!: string;
    }

    await expect(handleDtoValidation(data, TestClass)).rejects.toMatchObject({
      message: "Validation error",
      details: [
        ["title must be a string"],
        ["description must be longer than or equal to 3 characters"],
      ],
    });
  });
});
