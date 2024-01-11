const express = require("express");
const {
  getAllEmployees,
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
employeesRouter.get("/getEmployeeByID", verifyToken, getEmployeeByID);
employeesRouter.post("/addEmployee", verifyAdmin, addEmployee);
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
