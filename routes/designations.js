const express = require("express");
const designationRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  fetchDesignations,
  createDesignation,
  editDesignation,
  deleteDesignation,
} = require("../controllers/designation.controller");

designationRouter
  .route("/?:id?")
  .get(verifyAdmin, fetchDesignations)
  .post(verifyAdmin, createDesignation)
  .patch(verifyAdmin, editDesignation)
  .delete(verifyAdmin, deleteDesignation);

module.exports = designationRouter;
