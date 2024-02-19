import { RegisterDTO, UpdateUserDTO } from "../../dtos/userDto";
import { UserDocumentInterface } from "../../models/user";

export interface UserServiceInterface {
  createUser(userData: RegisterDTO): Promise<UserDocumentInterface>;

  findUserByEmail(email: string): Promise<UserDocumentInterface | null>;

  findUserById(id: string): Promise<UserDocumentInterface | null>;

  comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  findUsers(): Promise<UserDocumentInterface[]>;

  updateUser(
    id: string,
    updateData: UpdateUserDTO
  ): Promise<UserDocumentInterface | null>;

  deleteUser(id: string): Promise<boolean>;
}
