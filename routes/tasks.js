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
  fetchInactiveEmployees,
  fetchEmployeesTasksStats,
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

tasksRouter.get(
  "/fetchInactiveEmployees?:date?:employee?:project?",
  verifyToken,
  fetchInactiveEmployees
);

tasksRouter.get(
  "/fetchEmployeesTasksStats?:date?:employee?:project?",
  verifyToken,
  fetchEmployeesTasksStats
);

// Charts
tasksRouter.get(
  "/charts/dayWiseCount?:date?:employee?:project?",
  verifyAdmin,
  fetchDayWiseCount
);
tasksRouter.get(
  "/charts/dayWiseEmployeesCount?:date:employee?:project?",
  verifyAdmin,
  fetchDayWiseEmployeesCount
);
tasksRouter.get(
  "/charts/dayWiseProjectsCount?:date:employee?:project?",
  verifyAdmin,
  fetchDayWiseProjectsCount
);
tasksRouter.get(
  "/charts/dayWiseHours?:date:employee?:project?",
  verifyAdmin,
  fetchDayWiseHours
);
tasksRouter.get(
  "/charts/projectWiseHours?:date:employee?:project?",
  verifyAdmin,
  fetchProjectWiseHours
);
tasksRouter.get(
  "/charts/employeeWiseHours?:date?:employee?:project?",
  verifyAdmin,
  fetchEmployeeWiseHours
);
tasksRouter.get(
  "/charts/projectWiseContribution?:date?:employee?:project?",
  verifyAdmin,
  fetchProjectWiseContribution
);
tasksRouter.get(
  "/charts/employeesCount?:date?:employee?:project?",
  verifyAdmin,
  fetchUniqueEmployeesCount
);

tasksRouter.get(
  "/charts/projectsCount?:date?:employee?:project?",
  verifyAdmin,
  fetchUniqueProjectsCount
);
tasksRouter.get(
  "/charts/dayWiseAvg?:date?:employee?:project?",
  verifyAdmin,
  fetchDayWiseProjectsAvg
);
tasksRouter.get(
  "/charts/currentMonthTasks/:employeeID",
  verifyToken,
  fetchCurrentMonthTasks
);

module.exports = tasksRouter;
