import { Document, Query, Schema, model } from "mongoose";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
export const userRoleValues = [UserRole.USER] as const;
export interface UserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: UserRole;
}

export interface UserDocumentInterface extends UserInterface, Document {}

const userSchema = new Schema<UserDocumentInterface>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { timestamps: true }
);

const User = model<UserDocumentInterface>("User", userSchema);

export default User;
