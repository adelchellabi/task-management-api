import { Router } from "express";
import taskRoutes from "./taskRoutes";

const router = Router();

router.use("/tasks", taskRoutes);

export default router;
