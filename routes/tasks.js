const express = require("express");
const {
  addProjectTask,
  getProjectTaskByDate,
  getAllProjectTaskByDateRange,
  getAllProjectTaskByProjectAndEmployee,
  getAllProjectTaskByProject,
} = require("../controllers/projectTaskController");
const { verifyToken } = require("../utils/verifyToken");
const tasksRouter = express.Router();

tasksRouter.post("/addProjectTask", verifyToken, addProjectTask);
tasksRouter.post("/getProjectTaskByDate", verifyToken, getProjectTaskByDate);
tasksRouter.post(
  "/getAllProjectTaskByDateRange",
  verifyToken,
  getAllProjectTaskByDateRange
);
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
