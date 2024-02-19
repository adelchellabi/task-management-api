import {
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Length,
  IsMongoId,
} from "class-validator";

import { TaskPriority, taskPriorityValues } from "../models/task";
import { Trim } from "../decorators/trim";

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  @Trim()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3)
  @Trim()
  description!: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsEnum(taskPriorityValues, {
    message: "Priority must be one of the following values: $constraint1",
  })
  @IsOptional()
  priority?: TaskPriority;
}

export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  @Length(3)
  @Trim()
  title?: string;

  @IsOptional()
  @IsString()
  @Trim()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsEnum(taskPriorityValues, {
    message: "Priority must be one of the following values: $constraint1",
  })
  @IsOptional()
  priority?: TaskPriority;
}

export class TaskIdDTO {
  @IsMongoId()
  id!: string;
}
