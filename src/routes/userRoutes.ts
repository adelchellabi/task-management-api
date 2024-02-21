import express from "express";
import { UserController } from "../controllers/userController";
import { UserServiceInterface } from "../services/interfaces/userServiceInterface";
import { UserService } from "../services/userService";
import {
  authorizeRoles,
  isAuthenticated,
  checkOwnershipAuthorization,
} from "../middleware/authMiddleware";
import { UserRole } from "../models/user";

const router = express.Router();

const userService: UserServiceInterface = new UserService();
const userController: UserController = new UserController(userService);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get(
  "/",
  isAuthenticated,
  authorizeRoles([UserRole.ADMIN]),
  userController.findUsers
);

router.get("/profile", isAuthenticated, userController.getUserProfile);

router.get(
  "/:id",
  isAuthenticated,
  checkOwnershipAuthorization(userService),
  userController.findUserById
);

router.patch(
  "/:id",
  isAuthenticated,
  checkOwnershipAuthorization(userService),
  userController.updateUser
);

router.delete(
  "/:id",
  isAuthenticated,
  checkOwnershipAuthorization(userService),
  userController.deleteUser
);

router.get(
  "/profile/tasks",
  isAuthenticated,
  userController.getTasksForCurrentUser
);

router.get(
  "/:id/tasks",
  isAuthenticated,
  authorizeRoles([UserRole.ADMIN]),
  userController.getTasksByUserId
);
export default router;
