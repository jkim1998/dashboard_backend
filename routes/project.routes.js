import express from "express";

import {
  createProject,
  getAllProjects,
  getProjectDetail,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.route("/").post(createProject);
router.route("/").get(getAllProjects);
router.route("/:id").get(getProjectDetail);
router.route("/:id").patch(updateProject);
router.route("/:id").delete(deleteProject);

export default router;
