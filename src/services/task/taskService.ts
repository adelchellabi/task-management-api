import { CreateTaskDTO, UpdateTaskDTO } from "../../dtos/taskDto";
import { ResourceNotFoundError } from "../../exceptions/RessourceNotFoundError";
import Task, { TaskDocumentInterface } from "../../models/task";
import { TaskServiceInterface } from "./taskServiceInterface";

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
      return await Task.find({});
    } catch (error) {
      throw error;
    }
  }

  async findTaskById(id: string): Promise<TaskDocumentInterface | null> {
    try {
      const task = await Task.findById(id);
      if (!task) {
        throw new ResourceNotFoundError(`Task with ID '${id}' not found`);
      }
      return task;
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
}
