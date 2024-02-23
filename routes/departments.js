const express = require("express");
const departmentsRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  createDepartment,
  fetchDepartments,
  editDepartment,
  deleteDepartment,
} = require("../controllers/department.controller");

departmentsRouter
  .route("/?:id?")
  .get(verifyAdmin, fetchDepartments)
  .post(verifyAdmin, createDepartment)
  .patch(verifyAdmin, editDepartment)
  .delete(verifyAdmin, deleteDepartment);

module.exports = departmentsRouter;
