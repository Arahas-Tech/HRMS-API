const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema(
  {
    designationName: {
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

const DesignationModel = mongoose.model("designations", DesignationSchema);

module.exports = DesignationModel;
