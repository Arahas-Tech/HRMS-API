const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema(
  {
    stateName: {
      type: String,
      unique: true,
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

const StateModel = mongoose.model("states", StateSchema);

module.exports = StateModel;
