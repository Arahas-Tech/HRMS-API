const express = require("express");
const {
  getAllProjects,
  addProject,
  addEmployeeToProject,
  deleteProject,
  editProject,
  getProjectDetailByProjectCode,
  getProjectDetailsByManager,
  getProjectDetailByProjectCodeAndManager,
} = require("../controllers/projectController");
const projectsRouter = express.Router();

const { verifyToken } = require("../utils/verifyToken");

projectsRouter.get("/getAllProjects", verifyToken, getAllProjects);
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
projectsRouter.patch("/editProject", verifyToken, editProject);
projectsRouter.delete("/deleteProject/:id", verifyToken, deleteProject);

module.exports = projectsRouter;
