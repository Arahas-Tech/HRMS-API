const express = require("express");
const {
  getAllEmployees,
  deleteEmployee,
  addEmployee,
  updateTraining,
  editEmployee,
} = require("../controllers/employeeController");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");
const employeesRouter = express.Router();

employeesRouter.get("/getAllEmployees", verifyAdmin, getAllEmployees);
employeesRouter.post("/addEmployee", verifyAdmin, addEmployee);

employeesRouter.post("/editEmployee", verifyAdmin, editEmployee);
employeesRouter.post("/deleteEmployee/:id", verifyAdmin, deleteEmployee);

employeesRouter.post("/updateTraining/:id", verifyToken, updateTraining);

module.exports = employeesRouter;
