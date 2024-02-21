import { Request, Response, Router } from "express";
import taskRoutes from "./taskRoutes";
import userRouter from "./userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swager.json";

const router = Router();

router.use("/tasks", taskRoutes);
router.use("/users", userRouter);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get('/', (req: Request, res: Response) => {
  res.redirect('/api/v1/api-docs');
});

export default router;
