const express = require("express");
const {
  getAllRoles,
  addRole,
  deleteRole,
  editRole,
} = require("../controllers/rolesController");
const rolesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");

rolesRouter.get("/getAllRoles", verifyAdmin, getAllRoles);
rolesRouter.post("/addRoles", verifyAdmin, addRole);
rolesRouter.post("/editRole", verifyAdmin, editRole);
rolesRouter.post("/deleteRoles/:id", verifyAdmin, deleteRole);

module.exports = rolesRouter;
