const express = require("express");
const {
  addProjectTask,
  getProjectTaskByDate,
  getAllProjectTaskOfEmployee,
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
  "/getAllProjectTaskOfEmployee",
  verifyToken,
  getAllProjectTaskOfEmployee
);

module.exports = projectTaskRouter;
