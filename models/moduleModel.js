const mongoose = require("mongoose");

const ModulesSchema = new mongoose.Schema(
  {
    moduleID: {
      type: String,
      maxlength: 25,
      unique: true,
      required: true,
    },
    moduleName: {
      type: String,
      minlength: 2,
      maxlength: 25,
      unique: true,
      required: true,
    },
    operationsAllowed: {
      type: [String], // Array of strings,
      enum: ["create", "read", "update", "delete"], // enum of operations allowed
      required: true,
      default: [], // Empty array by default
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ModulesModel = mongoose.model("modules", ModulesSchema);

module.exports = ModulesModel;
