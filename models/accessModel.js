const mongoose = require("mongoose");

const AccessSchema = new mongoose.Schema(
  {
    accessID: {
      type: String,
      maxlength: 25,
      unique: true,
      required: true,
    },
    accessName: {
      type: String,
      minlength: 2,
      maxlength: 25,
      unique: true,
      required: true,
    },
    accessibleModules: [
      {
        moduleID: {
          type: String,
          ref: "modules",
          required: true,
        },
        operationsAllowed: {
          type: [String], // Array of strings
          enum: ["create", "read", "update", "delete"], // enum of operations allowed
          required: true,
          default: [], // Empty array by default
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const AccessModel = mongoose.model("accesses", AccessSchema);

module.exports = AccessModel;
