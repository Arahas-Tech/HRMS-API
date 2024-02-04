const express = require("express");
const citiesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  addCity,
  getAllCities,
  editCity,
  deleteCity,
} = require("../controllers/citiesController");

citiesRouter.get("/getAllCities", verifyAdmin, getAllCities);
citiesRouter.post("/addCity", verifyAdmin, addCity);
citiesRouter.patch("/editCity", verifyAdmin, editCity);
citiesRouter.delete("/deleteCity/:id", verifyAdmin, deleteCity);

module.exports = citiesRouter;
