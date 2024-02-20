const express = require("express");
const accessRouter = express.Router();
const {
  createAccess,
  fetchAccesses,
  deactivateAccess,
  activateAccess,
  deleteAccess,
} = require("../controllers/accessController");
const { verifyAdmin } = require("../utils/verifyToken");

accessRouter
  .route("/:accessID?")
  .get(verifyAdmin, fetchAccesses)
  .post(verifyAdmin, createAccess)
  .delete(verifyAdmin, deleteAccess);

accessRouter.route("/:accessID/activate").patch(verifyAdmin, activateAccess);
accessRouter
  .route("/:accessID/deactivate")
  .patch(verifyAdmin, deactivateAccess);

module.exports = accessRouter;
