import { Document, Schema, model } from "mongoose";
import Task from "./task";

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
  tasks?: Array<Schema.Types.ObjectId>;
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
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.tasks;
  return user;
};

userSchema.pre("findOneAndDelete", async function (next) {
  const user = this.getQuery();
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = model<UserDocumentInterface>("User", userSchema);

export default User;
