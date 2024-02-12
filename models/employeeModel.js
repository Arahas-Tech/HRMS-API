const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      minlength: 6,
      maxlength: 25,
      unique: true,
      required: true,
    },
    employeeName: {
      type: String,
      minlength: 3,
      maxlength: 25,
      unique: true,
      required: true,
    },
    employeeEmail: {
      type: String,
      minlength: 5,
      maxlength: 255,
      unique: true,
      required: true,
    },
    employeePassword: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      unique: true,
      required: true,
    },
    employeeDesignation: { type: mongoose.Schema.ObjectId, required: true },
    employeeWorkingState: { type: mongoose.Schema.ObjectId, required: true },
    employeeWorkingLocation: { type: mongoose.Schema.ObjectId, required: true },
    departmentID: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    roleID: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: true,
    },
    reportingManager: {
      type: String,
      required: false,
    },
    trainingsCompleted: [
      {
        training: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "trainings",
          unique: false,
        },
        completedOn: {
          type: Date,
          required: true,
        },
      },
    ],
    dateOfJoining: {
      type: Date,
      required: true,
      default: new Date(),
    },
    accessToken: {
      type: String,
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

const EmployeeModel = mongoose.model("employees", EmployeeSchema);

module.exports = EmployeeModel;
