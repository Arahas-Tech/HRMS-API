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
  editTask,
} = require("../controllers/task.controller");
const { verifyToken, verifyAdmin } = require("../utils/verifyToken");
const tasksRouter = express.Router();

tasksRouter.get("/", verifyAdmin, fetchAllTasks);
tasksRouter.post("/createTask", verifyToken, createTask);
tasksRouter.post("/editTask", verifyToken, editTask);
tasksRouter.post("/fetchTasksByDate", verifyToken, fetchTasksByDate);
tasksRouter.post("/fetchTasksByDates", verifyToken, fetchTasksByDates);
tasksRouter.post("/fetchTaskByProject", verifyToken, fetchTaskByProject);
tasksRouter.post(
  "/fetchProjectHoursByDate",
  verifyToken,
  fetchProjectHoursByDate
);

// Charts
tasksRouter.get(
  "/charts/dayWiseCount?:date?:employee?",
  verifyAdmin,
  fetchDayWiseCount
);
tasksRouter.get(
  "/charts/dayWiseEmployeesCount?:date:employee?",
  verifyAdmin,
  fetchDayWiseEmployeesCount
);
tasksRouter.get(
  "/charts/dayWiseProjectsCount?:date:employee?",
  verifyAdmin,
  fetchDayWiseProjectsCount
);
tasksRouter.get(
  "/charts/dayWiseHours?:date:employee?",
  verifyAdmin,
  fetchDayWiseHours
);
tasksRouter.get(
  "/charts/projectWiseHours?:date:employee?",
  verifyAdmin,
  fetchProjectWiseHours
);
tasksRouter.get(
  "/charts/employeeWiseHours?:date?:employee?",
  verifyAdmin,
  fetchEmployeeWiseHours
);
tasksRouter.get(
  "/charts/projectWiseContribution?:date?:employee?",
  verifyAdmin,
  fetchProjectWiseContribution
);
tasksRouter.get(
  "/charts/employeesCount?:date?:employee?",
  verifyAdmin,
  fetchUniqueEmployeesCount
);

tasksRouter.get(
  "/charts/projectsCount?:date?:employee?",
  verifyAdmin,
  fetchUniqueProjectsCount
);
tasksRouter.get(
  "/charts/dayWiseAvg?:date?:employee?",
  verifyAdmin,
  fetchDayWiseProjectsAvg
);
tasksRouter.get(
  "/charts/currentMonthTasks/:employeeID",
  verifyToken,
  fetchCurrentMonthTasks
);

module.exports = tasksRouter;
