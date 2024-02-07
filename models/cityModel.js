const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      unique: true,
      required: true,
    },
    stateID: {
      type: mongoose.Schema.ObjectId,
      ref: "states",
      unique: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: true,
    },
  },
  { timestamps: true }
);

const CityModel = mongoose.model("cities", CitySchema);

module.exports = CityModel;
