const express = require("express");
const {
  getAllTrainings,
  addTrainings,
} = require("../controllers/trainingsController");
const trainingRoutes = express.Router();

const { verifyToken } = require("../utils/verifyToken");

trainingRoutes.get("/getAllTrainings", verifyToken, getAllTrainings);
trainingRoutes.post("/addTrainings", addTrainings);

module.exports = trainingRoutes;
