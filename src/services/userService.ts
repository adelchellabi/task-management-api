import bcrypt from "bcryptjs";
import { UserServiceInterface } from "./interfaces/userServiceInterface";
import { RegisterDTO, UpdateUserDTO } from "../dtos/userDto";
import User, { UserDocumentInterface } from "../models/user";
import { ResourceNotFoundError } from "../exceptions/RessourceNotFoundError";
import { hashPassword } from "../utils/utils";

export class UserService implements UserServiceInterface {
  public async createUser(
    userData: RegisterDTO
  ): Promise<UserDocumentInterface> {
    try {
      const hashedPassword = await hashPassword(userData.password);
      return await User.create({ ...userData, password: hashedPassword });
    } catch (error) {
      throw error;
    }
  }

  public async findUserById(id: string): Promise<UserDocumentInterface> {
    try {
      const user = await User.findById(id).select("-password");
      if (!user) {
        throw new ResourceNotFoundError(`User with ID '${id}' not found`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findUserByEmail(
    email: string
  ): Promise<UserDocumentInterface | null> {
    try {
      return User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  public async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  public async findUsers(): Promise<UserDocumentInterface[]> {
    try {
      return await User.find({}).select("-password");
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(
    id: string,
    updateData: UpdateUserDTO
  ): Promise<UserDocumentInterface | null> {
    try {
      await this.findUserById(id);

      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(id: string): Promise<boolean> {
    try {
      await this.findUserById(id);
      await User.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
