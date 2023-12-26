const express = require("express");
const {
  getAllTrainings,
  addTrainings,
  deleteTraining,
  getTrainingsDetailByID,
  getAllTrainingsCount,
  editTraining,
} = require("../controllers/trainingsController");
const trainingRoutes = express.Router();

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

trainingRoutes.get("/getAllTrainings", verifyToken, getAllTrainings);
trainingRoutes.get(
  "/getTrainingsDetails/:id",
  verifyToken,
  getTrainingsDetailByID
);
trainingRoutes.get("/getAllTrainingsCount", verifyToken, getAllTrainingsCount);
trainingRoutes.post("/addTrainings", verifyAdmin, addTrainings);
trainingRoutes.post("/editTraining", verifyAdmin, editTraining);
trainingRoutes.post("/deleteTrainings/:id", verifyAdmin, deleteTraining);

module.exports = trainingRoutes;
