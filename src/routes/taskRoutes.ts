import { Router } from "express";

import { TaskServiceInterface } from "../services/interfaces/taskServiceInterface";
import { TaskService } from "../services/taskService";
import { TaskController } from "../controllers/taskController";
import { authorizeRoles, isAuthenticated } from "../middleware/authMiddleware";
import { UserRole } from "../models/user";

const router = Router();

const taskService: TaskServiceInterface = new TaskService();
const taskController: TaskController = new TaskController(taskService);

router.post(
  "/",
  isAuthenticated,
  authorizeRoles([UserRole.ADMIN]),
  taskController.createTask
);

router.get("/", taskController.findAllTasks);

router.get("/:id", taskController.findTaskById);

router.patch("/:id", isAuthenticated, taskController.updateTask);

router.delete("/:id", isAuthenticated, taskController.deleteTask);

export default router;
