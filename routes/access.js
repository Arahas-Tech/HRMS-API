const express = require("express");
const accessRouter = express.Router();
const {
  createAccess,
  fetchAccesses,
  deactivateAccess,
  activateAccess,
  deleteAccess,
  fetchPermissionByID,
} = require("../controllers/access.controller");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");

accessRouter
  .route("/:accessID?")
  .get(verifyAdmin, fetchAccesses)
  .post(verifyAdmin, createAccess)
  .delete(verifyAdmin, deleteAccess);

accessRouter.route("/fetch/:accessID").get(verifyToken, fetchPermissionByID);

accessRouter.route("/:accessID/activate").patch(verifyAdmin, activateAccess);
accessRouter
  .route("/:accessID/deactivate")
  .patch(verifyAdmin, deactivateAccess);

module.exports = accessRouter;
