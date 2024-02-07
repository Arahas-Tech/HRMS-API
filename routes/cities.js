const express = require("express");
const citiesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  addCity,
  getAllCities,
  fetchCitiesByState,
  editCity,
  deleteCity,
} = require("../controllers/citiesController");

citiesRouter.get("/getAllCities", verifyAdmin, getAllCities);
citiesRouter.get("/fetchCitiesByState?:id", verifyAdmin, fetchCitiesByState);
citiesRouter.post("/addCity", verifyAdmin, addCity);
citiesRouter.patch("/editCity", verifyAdmin, editCity);
citiesRouter.delete("/deleteCity/:id", verifyAdmin, deleteCity);

module.exports = citiesRouter;
