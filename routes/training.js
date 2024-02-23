const express = require("express");
const {
  getAllTrainings,
  addTraining,
  deleteTraining,
  getTrainingsDetailByID,
  getAllTrainingsCount,
  editTraining,
} = require("../controllers/trainings.controller");
const trainingsRouter = express.Router();

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

trainingsRouter.get("/getAllTrainings", verifyToken, getAllTrainings);
trainingsRouter.get(
  "/getTrainingsDetails/:id",
  verifyToken,
  getTrainingsDetailByID
);
trainingsRouter.get("/getAllTrainingsCount", verifyToken, getAllTrainingsCount);
trainingsRouter.post("/addTraining", verifyAdmin, addTraining);
trainingsRouter.patch("/editTraining", verifyAdmin, editTraining);
trainingsRouter.post("/deleteTrainings/:id", verifyAdmin, deleteTraining);

module.exports = trainingsRouter;
