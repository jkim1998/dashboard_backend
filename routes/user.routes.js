import express from "express";

import {
  createUser,
  createUserEmailPassword,
  getAllUsers,
  getUserInfoByID,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
// router.route("/").post(createUser);
router.route("/").post(createUserEmailPassword);
router.route("/:id").get(getUserInfoByID);
router.route("/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);

export default router;
