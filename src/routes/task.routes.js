import { Router } from "express";
import {
  getTask,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";
import { validateProjectPermission } from "../middlewares/auth.midddleware.js";
import { AvailableUserRole } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(validateProjectPermission(AvailableUserRole), getTask)
  .post(
    validateProjectPermission(AvailableUserRole),
    upload.array("files"),
    createTask
  );

router
  .route("/:taskId")
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(validateProjectPermission(AvailableUserRole), updateTask)
  .delete(validateProjectPermission(AvailableUserRole), deleteTask);

router
  .route("/:taskId/subtasks")
  .post(validateProjectPermission(AvailableUserRole), createSubTask);

router
  .route("/:taskId/subtasks/:subTaskId")
  .put(validateProjectPermission(AvailableUserRole), updateSubTask)
  .delete(validateProjectPermission(AvailableUserRole), deleteSubTask);

export default router;
