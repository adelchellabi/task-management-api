import { Trim } from "../../src/decorators/trim";
import { handleDtoValidation } from "../../src/dtos/helper";

describe("Trim Decorator", () => {
  it("should trim string values", async () => {
    class TestClass {
      @Trim()
      value!: string;
    }
    const dtoObject = await handleDtoValidation(
      { value: " trim me " },
      TestClass
    );

    expect(dtoObject.value).toBe("trim me");
  });
});
