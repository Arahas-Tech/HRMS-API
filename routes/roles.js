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
rolesRouter.post("/addRole", verifyAdmin, addRole);
rolesRouter.patch("/editRole", verifyAdmin, editRole);
rolesRouter.delete("/deleteRoles/:id", verifyAdmin, deleteRole);

module.exports = rolesRouter;
