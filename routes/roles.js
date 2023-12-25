const express = require("express");
const {
  getAllRoles,
  addRole,
  deleteRole,
} = require("../controllers/rolesController");
const roleRoutes = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");

roleRoutes.get("/getAllRoles", verifyAdmin, getAllRoles);
roleRoutes.post("/addRoles", verifyAdmin, addRole);
roleRoutes.post("/deleteRoles/:id", verifyAdmin, deleteRole);

module.exports = roleRoutes;
