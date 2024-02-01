const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
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

const DepartmentModel = mongoose.model("departments", DepartmentSchema);

module.exports = DepartmentModel;
