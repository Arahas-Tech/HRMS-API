const mongoose = require("mongoose");

const RolesSchema = new mongoose.Schema(
  {
    roleID: {
      type: String,
      minlength: 6,
      maxlength: 25,
      unique: true,
      required: true,
    },
    roleName: {
      type: String,
      minlength: 2,
      maxlength: 25,
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const RolesModel = mongoose.model("roles", RolesSchema);

module.exports = RolesModel;
