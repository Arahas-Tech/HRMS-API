const { isValidObjectId } = require("mongoose");
const CityModel = require("../models/cityModel");
const createError = require("../utils/errorHandler");

module.exports.addCity = async (req, res, next) => {
  try {
    const data = req.body;

    const existingCity = await CityModel.findOne({
      cityName: data.cityName,
    });

    if (existingCity) {
      return next(createError(400, "City already exists!"));
    }

    const newCity = new CityModel(data);
    await newCity.save();

    res.status(200).json("City added successfully!");
  } catch (error) {
    next(createError(500, error.message || "Internal Server Error"));
  }
};

module.exports.getAllCities = async (_req, res, next) => {
  try {
    const citiesList = await CityModel.aggregate([
      {
        $lookup: {
          from: "states",
          localField: "stateID",
          foreignField: "_id",
          as: "stateNameArray",
        },
      },
      {
        $unwind: "$stateNameArray",
      },
      {
        $project: {
          _id: 1,
          cityName: 1,
          stateName: "$stateNameArray.stateName",
        },
      },
    ]);

    return res.status(200).json(citiesList);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.editCity = async (req, res, next) => {
  try {
    let { cityID, editedCityName } = req.body;

    const existingCity = await CityModel.find({
      cityName: editedCityName.trim(),
    });

    // ? Check if existingCity array has any elements
    if (existingCity && existingCity.length > 0) {
      return next(createError(500, "City already exists"));
    }

    await CityModel.findOneAndUpdate(
      { _id: cityID },
      {
        $set: {
          cityName: editedCityName.trim(),
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.deleteCity = async (req, res, next) => {
  try {
    let cityID = req.params.id;
    const deletedCity = await CityModel.findByIdAndDelete(cityID);

    return res.status(200).json({
      message: "City successFully deleted!",
      data: deletedCity,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.fetchCitiesByState = async (req, res, next) => {
  try {
    const stateID = req.query.id;

    const filteredCities = await CityModel.find({
      stateID: stateID,
    });

    if (!filteredCities) {
      return next(createError(404, "No city found for selected state!"));
    }

    const modifiedFilteredCities = filteredCities.map((city) => ({
      cityName: city.cityName,
      cityID: city._id,
    }));

    return res.status(200).json(modifiedFilteredCities);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error.message}`));
  }
};
