import { Router } from "express";
import taskRoutes from "./taskRoutes";
import userRouter from "./userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swager.json";

const router = Router();

router.use("/tasks", taskRoutes);
router.use("/users", userRouter);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
