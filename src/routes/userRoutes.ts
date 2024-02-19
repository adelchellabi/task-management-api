import express from "express";
import { UserController } from "../controllers/userController";
import { UserServiceInterface } from "../services/interfaces/userServiceInterface";
import { UserService } from "../services/userService";
import { authorizeRoles, isAuthenticated } from "../middleware/authMiddleware";
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

router.get("/:id", isAuthenticated, userController.findUserById);

router.patch("/:id", isAuthenticated, userController.updateUser);

router.delete("/:id", isAuthenticated, userController.deleteUser);

export default router;
