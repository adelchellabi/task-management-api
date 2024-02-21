import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  LoginDTO,
  RegisterDTO,
  UpdateUserDTO,
  UserIdDTO,
} from "../dtos/userDto";
import { UserServiceInterface } from "../services/interfaces/userServiceInterface";
import { handleDtoValidation } from "../dtos/helper";
import { BaseController } from "./baseController";
import { UnauthorizedError } from "../exceptions/UnauthorizedError";
import { generateToken } from "../utils/utils";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { ResourceNotFoundError } from "../exceptions/RessourceNotFoundError";

export class UserController extends BaseController {
  constructor(private userService: UserServiceInterface) {
    super();
  }

  public register = async (req: Request, res: Response) => {
    try {
      const userData = await handleDtoValidation(req.body, RegisterDTO);

      const user = await this.userService.createUser(userData);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData = await handleDtoValidation(req.body, LoginDTO);
      const user = await this.userService.findUserByEmail(loginData.email);

      if (!user) {
        throw new ResourceNotFoundError(
          `User with email '${loginData.email}' not found`
        );
      }

      await this.checkPasswordMatch(loginData.password, user.password);

      const token = generateToken({ id: user._id, role: user.role });

      res.status(StatusCodes.OK).json({ token });
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  private async checkPasswordMatch(
    providedPassword: string,
    storedPassword: string
  ): Promise<void> {
    const passwordMatch = await this.userService.comparePasswords(
      providedPassword,
      storedPassword
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }
  }

  public findUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.findUsers();
      res.status(StatusCodes.OK).json(users);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public findUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id: userIdFromParams } = await handleDtoValidation(
        req.params,
        UserIdDTO
      );

      const user = await this.userService.findUserById(userIdFromParams);

      res.status(StatusCodes.OK).json(user);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public getUserProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const userProfile = await this.userService.findUserById(req.user.id);

      res.status(StatusCodes.OK).json(userProfile);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };

  public updateUser = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id: userIdFromParams } = await handleDtoValidation(
        req.params,
        UserIdDTO
      );

      const updateData = await handleDtoValidation(req.body, UpdateUserDTO);

      const updatedUser = await this.userService.updateUser(
        userIdFromParams,
        updateData
      );

      res.status(StatusCodes.OK).json(updatedUser);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public deleteUser = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id: userIdFromParams } = await handleDtoValidation(
        req.params,
        UserIdDTO
      );
      const result = await this.userService.deleteUser(userIdFromParams);

      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public getTasksByUserId = async (req: Request, res: Response) => {
    try {
      const { id } = await handleDtoValidation(req.params, UserIdDTO);
      const tasks = await this.userService.getTasksByUserId(id);

      res.status(StatusCodes.OK).json(tasks);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public getTasksForCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const id = req.user!.id;
      const tasks = await this.userService.getTasksByUserId(id);

      res.status(StatusCodes.OK).json(tasks);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };
}
