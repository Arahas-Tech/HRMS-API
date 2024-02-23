const express = require("express");
const accessRouter = express.Router();
const {
  createModule,
  fetchModules,
  deactivateModule,
  activateModule,
  deleteModule,
} = require("../controllers/modules.controller");
const { verifyAdmin } = require("../utils/verifyToken");

accessRouter
  .route("/:accessID?")
  .get(verifyAdmin, fetchModules)
  .post(verifyAdmin, createModule)
  .delete(verifyAdmin, deleteModule);

accessRouter.route("/:accessID/activate").patch(verifyAdmin, activateModule);
accessRouter
  .route("/:accessID/deactivate")
  .patch(verifyAdmin, deactivateModule);

module.exports = accessRouter;
