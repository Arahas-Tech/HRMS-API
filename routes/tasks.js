const express = require("express");
const {
  createTask,
  fetchTaskByDate,
  fetchTaskByDates,
  getAllProjectTaskByProjectAndEmployee,
  getAllProjectTaskByProject,
} = require("../controllers/task.controller");
const { verifyToken } = require("../utils/verifyToken");
const tasksRouter = express.Router();

tasksRouter.post("/createTask", verifyToken, createTask);
tasksRouter.post("/fetchTaskByDate", verifyToken, fetchTaskByDate);
tasksRouter.post("/fetchTaskByDates", verifyToken, fetchTaskByDates);
tasksRouter.post(
  "/getAllProjectTaskByProjectAndEmployee",
  verifyToken,
  getAllProjectTaskByProjectAndEmployee
);
tasksRouter.post(
  "/getAllProjectTaskByProject",
  verifyToken,
  getAllProjectTaskByProject
);

module.exports = tasksRouter;
