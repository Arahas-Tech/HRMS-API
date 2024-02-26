const express = require("express");
const taskEditRouter = express.Router();

const { verifyToken } = require("../utils/verifyToken");
const {
  fetchManagerPendingApprovals,
  sendEditApproval,
  approveEditTask,
  rejectEditTask,
} = require("../controllers/taskEdit.controller");

taskEditRouter.route("/").post(verifyToken, sendEditApproval);
taskEditRouter.route("/:id").get(verifyToken, fetchManagerPendingApprovals);
taskEditRouter.route("/approveEdit").post(verifyToken, approveEditTask);
taskEditRouter.route("/rejectEdit").post(verifyToken, rejectEditTask);

module.exports = taskEditRouter;
