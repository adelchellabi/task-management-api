import { Router } from "express";

import { TaskServiceInterface } from "../services/task/taskServiceInterface";
import { TaskService } from "../services/task/taskService";
import { TaskController } from "../controllers/taskController";

const router = Router();

const taskService: TaskServiceInterface = new TaskService();
const taskController: TaskController = new TaskController(taskService);

router.post("/", taskController.createTask);
router.get("/", taskController.findAllTasks);
router.get("/:id", taskController.findTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
