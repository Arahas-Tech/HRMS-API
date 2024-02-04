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
    const getAllCity = await CityModel.find();
    return res.status(200).json(getAllCity);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.editCity = async (req, res, next) => {
  try {
    let { cityID, editedCityName } = req.body;

    await CityModel.findOneAndUpdate(
      { _id: cityID },
      {
        $set: {
          cityName: editedCityName,
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
