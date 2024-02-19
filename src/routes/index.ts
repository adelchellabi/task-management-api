import { Router } from "express";
import taskRoutes from "./taskRoutes";
import userRouter from "./userRoutes";

const router = Router();

router.use("/tasks", taskRoutes);
router.use("/users", userRouter);

export default router;
