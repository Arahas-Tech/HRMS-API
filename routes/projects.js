const express = require("express");
const {
  getAllProjects,
  addProject,
  deleteProject,
  editProject,
  getProjectDetailByProjectCode,
} = require("../controllers/projectController");
const projectsRouter = express.Router();

const { verifyToken } = require("../utils/verifyToken");

projectsRouter.get("/getAllProjects", verifyToken, getAllProjects);
projectsRouter.get(
  "/getProjectByID/:id",
  verifyToken,
  getProjectDetailByProjectCode
);
projectsRouter.post("/addProject", verifyToken, addProject);
projectsRouter.patch("/editProject", verifyToken, editProject);
projectsRouter.delete("/deleteProject/:id", verifyToken, deleteProject);

module.exports = projectsRouter;
