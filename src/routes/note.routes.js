import { Router } from "express";
import {
  getProjectNotes,
  createProjectNote,
  updateProjectNote,
  deleteProjectNote,
} from "../controllers/note.controllers.js";
import { validateProjectPermission } from "../middlewares/auth.midddleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { validate } from "../middlewares/validator.middleware.js";
import { body } from "express-validator";

const noteValidator = () => [
  body("content").trim().notEmpty().withMessage("Note content is required"),
];

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(validateProjectPermission(AvailableUserRole), getProjectNotes)
  .post(
    validateProjectPermission(AvailableUserRole),
    noteValidator(),
    validate,
    createProjectNote
  );

router
  .route("/:noteId")
  .put(
    validateProjectPermission(AvailableUserRole),
    noteValidator(),
    validate,
    updateProjectNote
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteProjectNote
  );

export default router;
