import { NextFunction, Request, Response, Router } from "express";
import taskRoutes from "./taskRoutes";
import userRouter from "./userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swager.json";

const router = Router();

router.use("/tasks", taskRoutes);
router.use("/users", userRouter);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use(customErrorMiddleware);

export default router;
export function customErrorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).json({ error: "Route not found" });
}
