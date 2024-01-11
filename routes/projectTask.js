const express = require("express");
const {
  addProjectTask,
  getProjectTaskByDate,
  getAllProjectTaskByDateRange,
  getAllProjectTaskByProjectAndEmployee,
  getAllProjectTaskByProject,
} = require("../controllers/projectTaskController");
const { verifyToken } = require("../utils/verifyToken");
const projectTaskRouter = express.Router();

projectTaskRouter.post("/addProjectTask", verifyToken, addProjectTask);
projectTaskRouter.post(
  "/getProjectTaskByDate",
  verifyToken,
  getProjectTaskByDate
);
projectTaskRouter.post(
  "/getAllProjectTaskByDateRange",
  verifyToken,
  getAllProjectTaskByDateRange
);
projectTaskRouter.post(
  "/getAllProjectTaskByProjectAndEmployee",
  verifyToken,
  getAllProjectTaskByProjectAndEmployee
);
projectTaskRouter.post(
  "/getAllProjectTaskByProject",
  verifyToken,
  getAllProjectTaskByProject
);

module.exports = projectTaskRouter;
