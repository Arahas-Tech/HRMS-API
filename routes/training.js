const express = require("express");
const {
  getAllTrainings,
  addTrainings,
  deleteTraining,
} = require("../controllers/trainingsController");
const trainingRoutes = express.Router();

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

trainingRoutes.get("/getAllTrainings", verifyToken, getAllTrainings);
trainingRoutes.post("/addTrainings", verifyAdmin, addTrainings);
trainingRoutes.post("/deleteTrainings/:id", verifyAdmin, deleteTraining);

module.exports = trainingRoutes;
