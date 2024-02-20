import { CreateTaskDTO, UpdateTaskDTO } from "../../dtos/taskDto";
import { TaskDocumentInterface } from "../../models/task";
import { ResourceServiceInterface } from "./resourceServiceInterface";

export interface TaskServiceInterface
  extends ResourceServiceInterface<TaskDocumentInterface> {
  createTask(taskData: CreateTaskDTO): Promise<TaskDocumentInterface>;
  findTaskByTitle(title: string): Promise<TaskDocumentInterface | null>;
  findAllTasks(): Promise<TaskDocumentInterface[]>;
  findTaskById(id: string): Promise<TaskDocumentInterface>;
  updateTask(
    id: string,
    updateData: UpdateTaskDTO
  ): Promise<TaskDocumentInterface | null>;
  deleteTask(id: string): Promise<boolean>;
  findTasksByOwnerId(id: string): Promise<TaskDocumentInterface[]>;
}
