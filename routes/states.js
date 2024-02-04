const express = require("express");
const statesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  addState,
  getAllStates,
  editState,
  deleteState,
} = require("../controllers/statesController");

statesRouter.get("/getAllStates", verifyAdmin, getAllStates);
statesRouter.post("/addState", verifyAdmin, addState);
statesRouter.patch("/editState", verifyAdmin, editState);
statesRouter.delete("/deleteState/:id", verifyAdmin, deleteState);

module.exports = statesRouter;
