const express = require("express");
const citiesRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  createCity,
  fetchCities,
  fetchCitiesForState,
  editCity,
  deleteCity,
} = require("../controllers/cities.controller");

citiesRouter
  .route("/?:id?")
  .get(verifyAdmin, fetchCities)
  .get(verifyAdmin, fetchCitiesForState)
  .post(verifyAdmin, createCity)
  .patch(verifyAdmin, editCity)
  .delete(verifyAdmin, deleteCity);

module.exports = citiesRouter;
