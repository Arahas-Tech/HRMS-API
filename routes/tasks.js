const express = require("express");
const {
  fetchAllTasks,
  createTask,
  fetchTaskByDate,
  fetchTaskByDates,
  fetchTaskByProject,
  fetchProjectHoursByDate,
  fetchDayWiseCount,
  fetchDayWiseEmployeesCount,
  fetchDayWiseProjectsCount,
  fetchDayWiseHours,
  fetchProjectWiseHours,
  fetchEmployeeWiseHours,
  fetchProjectWiseContribution,
  fetchUniqueEmployeesCount,
  fetchUniqueProjectsCount,
  fetchDayWiseProjectsAvg,
} = require("../controllers/task.controller");
const { verifyToken, verifyAdmin } = require("../utils/verifyToken");
const tasksRouter = express.Router();

tasksRouter.get("/", verifyAdmin, fetchAllTasks);
tasksRouter.post("/createTask", verifyToken, createTask);
tasksRouter.post("/fetchTaskByDate", verifyToken, fetchTaskByDate);
tasksRouter.post("/fetchTaskByDates", verifyToken, fetchTaskByDates);
tasksRouter.post("/fetchTaskByProject", verifyToken, fetchTaskByProject);
tasksRouter.post(
  "/fetchProjectHoursByDate",
  verifyToken,
  fetchProjectHoursByDate
);

// Charts
tasksRouter.get("/charts/dayWiseCount?:date", verifyAdmin, fetchDayWiseCount);
tasksRouter.get(
  "/charts/dayWiseEmployeesCount?:date",
  verifyAdmin,
  fetchDayWiseEmployeesCount
);
tasksRouter.get(
  "/charts/dayWiseProjectsCount?:date",
  verifyAdmin,
  fetchDayWiseProjectsCount
);
tasksRouter.get("/charts/dayWiseHours?:date", verifyAdmin, fetchDayWiseHours);
tasksRouter.get(
  "/charts/projectWiseHours?:date",
  verifyAdmin,
  fetchProjectWiseHours
);
tasksRouter.get(
  "/charts/employeeWiseHours?:date",
  verifyAdmin,
  fetchEmployeeWiseHours
);
tasksRouter.get(
  "/charts/projectWiseContribution?:date",
  verifyAdmin,
  fetchProjectWiseContribution
);
tasksRouter.get(
  "/charts/employeesCount?:date",
  verifyAdmin,
  fetchUniqueEmployeesCount
);

tasksRouter.get(
  "/charts/projectsCount?:date",
  verifyAdmin,
  fetchUniqueProjectsCount
);
tasksRouter.get(
  "/charts/dayWiseAvg?:date",
  verifyAdmin,
  fetchDayWiseProjectsAvg
);

module.exports = tasksRouter;
