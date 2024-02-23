const express = require("express");
const {
  createTask,
  fetchTaskByDate,
  fetchTaskByDates,
  fetchTaskByProject,
  fetchProjectHoursByDate,
} = require("../controllers/task.controller");
const { verifyToken } = require("../utils/verifyToken");
const tasksRouter = express.Router();

tasksRouter.post("/createTask", verifyToken, createTask);
tasksRouter.post("/fetchTaskByDate", verifyToken, fetchTaskByDate);
tasksRouter.post("/fetchTaskByDates", verifyToken, fetchTaskByDates);
tasksRouter.post("/fetchTaskByProject", verifyToken, fetchTaskByProject);
tasksRouter.post(
  "/fetchProjectHoursByDate",
  verifyToken,
  fetchProjectHoursByDate
);

module.exports = tasksRouter;
