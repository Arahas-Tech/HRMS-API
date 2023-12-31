const express = require("express");
const {
  getAllTrainings,
  addTrainings,
  deleteTraining,
  getTrainingsDetailByID,
  getAllTrainingsCount,
  editTraining,
} = require("../controllers/trainingsController");
const trainingsRouter = express.Router();

const { verifyToken, verifyAdmin } = require("../utils/verifyToken");

trainingsRouter.get("/getAllTrainings", verifyToken, getAllTrainings);
trainingsRouter.get(
  "/getTrainingsDetails/:id",
  verifyToken,
  getTrainingsDetailByID
);
trainingsRouter.get("/getAllTrainingsCount", verifyToken, getAllTrainingsCount);
trainingsRouter.post("/addTrainings", verifyAdmin, addTrainings);
trainingsRouter.patch("/editTraining", verifyAdmin, editTraining);
trainingsRouter.post("/deleteTrainings/:id", verifyAdmin, deleteTraining);

module.exports = trainingsRouter;
