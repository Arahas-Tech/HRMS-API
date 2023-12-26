const express = require("express");
const {
  getAllRoles,
  addRole,
  deleteRole,
  editRole,
} = require("../controllers/rolesController");
const roleRoutes = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");

roleRoutes.get("/getAllRoles", verifyAdmin, getAllRoles);
roleRoutes.post("/addRoles", verifyAdmin, addRole);
roleRoutes.post("/editRole", verifyAdmin, editRole);
roleRoutes.post("/deleteRoles/:id", verifyAdmin, deleteRole);

module.exports = roleRoutes;
