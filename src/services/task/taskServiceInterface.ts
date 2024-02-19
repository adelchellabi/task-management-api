import { CreateTaskDTO, UpdateTaskDTO } from "../../dtos/taskDto";
import { TaskDocumentInterface } from "../../models/task";

export interface TaskServiceInterface {
  createTask(taskData: CreateTaskDTO): Promise<TaskDocumentInterface>;
  findTaskByTitle(title: string): Promise<TaskDocumentInterface | null>;
  findAllTasks(): Promise<TaskDocumentInterface[]>;
  findTaskById(id: string): Promise<TaskDocumentInterface | null>;
  updateTask(
    id: string,
    updateData: UpdateTaskDTO
  ): Promise<TaskDocumentInterface | null>;
  deleteTask(id: string): Promise<boolean>;
}
