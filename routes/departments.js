const express = require("express");
const departmentsRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  addDepartment,
  getAllDepartments,
  editDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

departmentsRouter.get("/getAllDepartments", verifyAdmin, getAllDepartments);
departmentsRouter.post("/addDepartment", verifyAdmin, addDepartment);
departmentsRouter.patch("/editDepartment", verifyAdmin, editDepartment);
departmentsRouter.delete(
  "/deleteDepartment/:id",
  verifyAdmin,
  deleteDepartment
);

module.exports = departmentsRouter;
