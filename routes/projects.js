const express = require("express");
const {
  getAllProjects,
  getAllProjectsByEmployee,
  addProject,
  addEmployeeToProject,
  removeEmployeeFromProject,
  deleteProject,
  editProject,
  getProjectDetailByProjectCode,
  getProjectDetailsByManager,
  getProjectDetailByProjectCodeAndManager,
  getAllProjectsDetailsByManager,
} = require("../controllers/projectController");
const projectsRouter = express.Router();

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

projectsRouter.get("/getAllProjects", verifyAdmin, getAllProjects);
projectsRouter.get(
  "/getAllProjectsByEmployee?:employeeID",
  verifyToken,
  getAllProjectsByEmployee
);
projectsRouter.get(
  "/getAllProjectDetailsByManager/:managerID",
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
  "/addEmployeeToProject/:projectCode",
  verifyToken,
  addEmployeeToProject
);
projectsRouter.post(
  "/removeEmployeeFromProject/:projectCode",
  verifyToken,
  removeEmployeeFromProject
);
projectsRouter.patch("/editProject/:projectCode", verifyToken, editProject);
projectsRouter.delete("/deleteProject/:id", verifyToken, deleteProject);

module.exports = projectsRouter;
