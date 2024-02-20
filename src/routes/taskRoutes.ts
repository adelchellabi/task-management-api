import { Router } from "express";

import { TaskServiceInterface } from "../services/interfaces/taskServiceInterface";
import { TaskService } from "../services/taskService";
import { TaskController } from "../controllers/taskController";
import { authorizeRoles, isAuthenticated } from "../middleware/authMiddleware";
import { UserRole } from "../models/user";

const router = Router();

const taskService: TaskServiceInterface = new TaskService();
const taskController: TaskController = new TaskController(taskService);

router.post("/", isAuthenticated, taskController.createTask);

router.get(
  "/",
  isAuthenticated,
  authorizeRoles([UserRole.ADMIN]),
  taskController.findAllTasks
);

router.get("/:id", isAuthenticated, taskController.findTaskById);

router.patch("/:id", isAuthenticated, taskController.updateTask);

router.delete("/:id", isAuthenticated, taskController.deleteTask);

export default router;
