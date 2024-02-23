const express = require("express");
const {
  fetchRoles,
  createRole,
  editRole,
  deleteRole,
} = require("../controllers/roles.controller");
const rolesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");

rolesRouter
  .route("/?:id?")
  .get(verifyAdmin, fetchRoles)
  .post(verifyAdmin, createRole)
  .patch(verifyAdmin, editRole)
  .delete(verifyAdmin, deleteRole);

module.exports = rolesRouter;
