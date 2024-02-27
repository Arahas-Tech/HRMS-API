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
  .route("/:id?")
  .get(verifyAdmin, fetchCities)
  .post(verifyAdmin, createCity)
  .patch(verifyAdmin, editCity)
  .delete(verifyAdmin, deleteCity);

citiesRouter.route("/state/:id").get(verifyAdmin, fetchCitiesForState);

module.exports = citiesRouter;
