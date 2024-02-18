import { Transform } from "class-transformer";

export function Trim(): PropertyDecorator {
  return function (target: Object, propertyName: string | symbol): void {
    Transform(({ value }) =>
      typeof value === "string" ? value.trim() : value
    )(target, propertyName);
  };
}
