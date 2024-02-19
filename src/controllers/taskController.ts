import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleDtoValidation } from "../dtos/helper";
import { CreateTaskDTO, TaskIdDTO, UpdateTaskDTO } from "../dtos/taskDto";
import { ResourceAlreadyExistsError } from "../exceptions/RessourceAlreadyExistsError";
import { TaskServiceInterface } from "../services/interfaces/taskServiceInterface";
import { BaseController } from "./baseController";

export class TaskController extends BaseController {
  constructor(private taskService: TaskServiceInterface) {
    super();
  }

  public createTask = async (req: Request, res: Response) => {
    try {
      const taskData = await handleDtoValidation(req.body, CreateTaskDTO);
      await this.checkTaskExists(taskData.title);

      const task = await this.taskService.createTask(taskData);
      res.status(StatusCodes.CREATED).json(task);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  private checkTaskExists = async (title: string) => {
    const existingTask = await this.taskService.findTaskByTitle(title);
    if (existingTask) {
      throw new ResourceAlreadyExistsError(
        `Task with title '${title}' already exists`
      );
    }
  };

  public findAllTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.findAllTasks();
      res.status(StatusCodes.OK).json(tasks);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public findTaskById = async (req: Request, res: Response) => {
    try {
      const { id } = await handleDtoValidation(req.params, TaskIdDTO);

      const task = await this.taskService.findTaskById(id);

      res.status(StatusCodes.OK).json(task);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public updateTask = async (req: Request, res: Response) => {
    try {
      const { id } = await handleDtoValidation(req.params, TaskIdDTO);
      const updateData = await handleDtoValidation(req.body, UpdateTaskDTO);

      const updatedTask = await this.taskService.updateTask(id, updateData);
      res.status(StatusCodes.OK).json(updatedTask);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };

  public deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = await handleDtoValidation(req.params, TaskIdDTO);

      const result = await this.taskService.deleteTask(id);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      this.handleRequestError(error, res);
    }
  };
}
