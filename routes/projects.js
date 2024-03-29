const express = require("express");
const {
  getAllProjects,
  fetchProjectsCount,
  getAllProjectsByEmployee,
  fetchRMProjects,
  addProject,
  addEmployeeToProject,
  removeEmployeeFromProject,
  deleteProject,
  editProject,
  getProjectDetailByProjectCode,
  getProjectDetailsByManager,
  getProjectDetailByProjectCodeAndManager,
  getAllProjectsDetailsByManager,
} = require("../controllers/project.controller");
const projectsRouter = express.Router();

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

projectsRouter.get("/getAllProjects", verifyToken, getAllProjects);
projectsRouter.get("/count", verifyAdmin, fetchProjectsCount);
projectsRouter.get(
  "/getAllProjectsByEmployee?:employeeID",
  verifyToken,
  getAllProjectsByEmployee
);
projectsRouter.get(
  "/fetchRMProjects?:employeeID",
  verifyToken,
  fetchRMProjects
);
projectsRouter.get(
  "/fetchPMProjectAll/:managerID",
  verifyToken,
  getAllProjectsDetailsByManager
);
projectsRouter.get(
  "/getProjectByID/:id",
  verifyToken,
  getProjectDetailByProjectCode
);
projectsRouter.get(
  "/getProjectByManager/:id",
  verifyToken,
  getProjectDetailsByManager
);
projectsRouter.get(
  "/getProjectDetailsByProjectAndManager/:id",
  verifyToken,
  getProjectDetailByProjectCodeAndManager
);
projectsRouter.post("/addProject", verifyToken, addProject);
projectsRouter.post(
  "/addEmployeeToProject/:code",
  verifyToken,
  addEmployeeToProject
);
projectsRouter.post(
  "/removeEmployeeFromProject/:code",
  verifyToken,
  removeEmployeeFromProject
);
projectsRouter.patch("/editProject/:code", verifyToken, editProject);
projectsRouter.delete("/deleteProject/:id", verifyToken, deleteProject);

module.exports = projectsRouter;
