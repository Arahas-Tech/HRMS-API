const express = require("express");
const statesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  createState,
  fetchStates,
  editState,
  deleteState,
} = require("../controllers/states.controller");

statesRouter
  .route("/?:id?")
  .get(verifyAdmin, fetchStates)
  .post(verifyAdmin, createState)
  .patch(verifyAdmin, editState)
  .delete(verifyAdmin, deleteState);

module.exports = statesRouter;
