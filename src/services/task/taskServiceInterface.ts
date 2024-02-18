import { CreateTaskDTO, UpdateTaskDto } from "../../dtos/taskDto";
import { TaskDocumentInterface } from "../../models/task";

export interface TaskServiceInterface {
  createTask(taskData: CreateTaskDTO): Promise<TaskDocumentInterface>;
  findTaskByTitle(title: string): Promise<TaskDocumentInterface | null>;
  findAllTasks(): Promise<TaskDocumentInterface[]>;
  findTaskById(id: string): Promise<TaskDocumentInterface | null>;
  updateTask(
    id: string,
    updateData: UpdateTaskDto
  ): Promise<TaskDocumentInterface | null>;
  deleteTask(id: string): Promise<boolean>;
}
