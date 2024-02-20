import { CreateTaskDTO, UpdateTaskDTO } from "../dtos/taskDto";
import { ResourceNotFoundError } from "../exceptions/RessourceNotFoundError";
import Task, { TaskDocumentInterface } from "../models/task";
import { TaskServiceInterface } from "./interfaces/taskServiceInterface";

export class TaskService implements TaskServiceInterface {
  async createTask(taskData: CreateTaskDTO): Promise<TaskDocumentInterface> {
    try {
      return await Task.create(taskData);
    } catch (error: any) {
      throw new Error("Failed to create task");
    }
  }

  async findTaskByTitle(title: string): Promise<TaskDocumentInterface | null> {
    try {
      return await Task.findOne({ title });
    } catch (error: any) {
      throw error;
    }
  }

  async findAllTasks(): Promise<TaskDocumentInterface[]> {
    try {
      return await Task.find({}).populate("owner", "firstName lastName");
    } catch (error) {
      throw error;
    }
  }

  async findTaskById(id: string): Promise<TaskDocumentInterface> {
    try {
      const task = await Task.findById(id).populate(
        "owner",
        "firstName lastName"
      );

      if (!task) {
        throw new ResourceNotFoundError(`Task with ID '${id}' not found`);
      }
      return task;
    } catch (error: any) {
      throw error;
    }
  }

  async findTasksByOwnerId(id: string): Promise<TaskDocumentInterface[]> {
    try {
      return await Task.find({ owner: id }).populate(
        "owner",
        "firstName lastName"
      );
    } catch (error: any) {
      throw error;
    }
  }

  public async updateTask(
    id: string,
    updateData: UpdateTaskDTO
  ): Promise<TaskDocumentInterface | null> {
    try {
      await this.findTaskById(id);
      const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTask(id: string): Promise<boolean> {
    try {
      await this.findTaskById(id);
      await Task.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  getOwnerId(resource: TaskDocumentInterface): string {
    const owner: any = resource.owner;
    return owner!._id.toString();
  }

  async findById(resourceId: string): Promise<TaskDocumentInterface> {
    return await this.findTaskById(resourceId);
  }
}
