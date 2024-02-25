const express = require("express");
const {
  fetchAllTasks,
  createTask,
  fetchTasksByDate,
  fetchTasksByDates,
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
  fetchCurrentMonthTasks,
} = require("../controllers/task.controller");
const { verifyToken, verifyAdmin } = require("../utils/verifyToken");
const tasksRouter = express.Router();

tasksRouter.get("/", verifyAdmin, fetchAllTasks);
tasksRouter.post("/createTask", verifyToken, createTask);
tasksRouter.post("/fetchTasksByDate", verifyToken, fetchTasksByDate);
tasksRouter.post("/fetchTasksByDates", verifyToken, fetchTasksByDates);
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
tasksRouter.get(
  "/charts/currentMonthTasks/:employeeID",
  verifyToken,
  fetchCurrentMonthTasks
);

module.exports = tasksRouter;
