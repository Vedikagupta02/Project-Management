
import { Router } from "express";
import {
  getProjects,
  getProjectByID,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  updateProjectMemberRole,
  removeProjectMember,
} from "../controllers/project.controllers.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.midddleware.js";
import { createProjectValidator, addMemberToProjectValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import taskRouter from "./task.routes.js";
import noteRouter from "./note.routes.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getProjects).post(createProjectValidator(), validate, createProject);

router.route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getProjectByID)
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), createProjectValidator(), validate, updateProject)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProject);

router.route("/:projectId/members")
  .get(validateProjectPermission(AvailableUserRole), getProjectMembers)
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), addMemberToProjectValidator(), validate, addProjectMember);

router.route("/:projectId/members/:userId")
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateProjectMemberRole)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), removeProjectMember);

router.use("/:projectId/tasks", taskRouter);
router.use("/:projectId/notes", noteRouter);

export default router;
