const express = require("express");
const {
  getAllEmployees,
  deleteEmployee,
  addEmployee,
  updateTraining,
  editEmployee,
} = require("../controllers/employeeController");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");
const employeesRoute = express.Router();

employeesRoute.get("/getAllEmployees", verifyAdmin, getAllEmployees);
employeesRoute.post("/addEmployee", verifyAdmin, addEmployee);

employeesRoute.post("/editEmployee", verifyAdmin, editEmployee);
employeesRoute.post("/deleteEmployee/:id", verifyAdmin, deleteEmployee);

employeesRoute.post("/updateTraining/:id", verifyToken, updateTraining);

module.exports = employeesRoute;
