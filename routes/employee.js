const express = require("express");
const {
  getAllEmployees,
  getAllManagers,
  getAllEmployeesForManager,
  getEmployeeByID,
  deleteEmployee,
  addEmployee,
  bulkAddEmployees,
  updateTraining,
  editEmployee,
} = require("../controllers/employeeController");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");
const multer = require("multer");
const employeesRouter = express.Router();

const upload = multer({ dest: "uploads/" });

employeesRouter.get("/getAllEmployees", verifyAdmin, getAllEmployees);
employeesRouter.get("/getAllManagers", verifyAdmin, getAllManagers);
employeesRouter.get(
  "/getAllEmployeesForManager",
  verifyToken,
  getAllEmployeesForManager
);
employeesRouter.get(
  "/getEmployeeByID?:employeeID",
  verifyAdmin,
  getEmployeeByID
);
employeesRouter.post("/addEmployee", addEmployee);
employeesRouter.post(
  "/bulkAdd",
  upload.single("file"),
  verifyAdmin,
  bulkAddEmployees
);

employeesRouter.patch("/editEmployee", verifyAdmin, editEmployee);
employeesRouter.post("/deleteEmployee/:id", verifyAdmin, deleteEmployee);

employeesRouter.patch("/updateTraining/:id", verifyToken, updateTraining);

module.exports = employeesRouter;
