const express = require("express");
const taskEditRouter = express.Router();

const { verifyAdmin, verifyToken } = require("../utils/verifyToken");
const {
  fetchManagerPendingApprovals,
  sendEditApproval,
  approveEditTask,
  rejectEditTask,
} = require("../controllers/taskEdit.controller");

taskEditRouter.route("/").post(verifyToken, sendEditApproval);
taskEditRouter.route("/:id").get(verifyToken, fetchManagerPendingApprovals);
taskEditRouter.route("/approveEditTask").post(verifyToken, approveEditTask);
taskEditRouter.route("/rejectEditTask").post(verifyToken, rejectEditTask);

module.exports = taskEditRouter;
