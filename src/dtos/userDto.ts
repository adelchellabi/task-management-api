import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
  IsMongoId,
  IsOptional,
} from "class-validator";
import { Trim } from "../decorators/trim";
import { UserRole, userRoleValues } from "../models/user";

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3)
  @Trim()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3)
  @Trim()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(userRoleValues, {
    message: "Role must be one of the following values: $constraint1",
  })
  role!: UserRole;
}

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  password!: string;
}

export class UserIdDTO {
  @IsMongoId()
  id!: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(3)
  @Trim()
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(3)
  @Trim()
  lastName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(6)
  password?: string;
}
