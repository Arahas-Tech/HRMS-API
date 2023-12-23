const express = require("express");
const { getAllEmployees } = require("../controllers/employeeController");
const { verifyAdmin } = require("../utils/verifyToken");
const employeesRoute = express.Router();

employeesRoute.get("/employeesData", verifyAdmin, getAllEmployees);

module.exports = employeesRoute;
