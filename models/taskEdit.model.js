const mongoose = require("mongoose");

const TaskEditSchema = new mongoose.Schema(
  {
    sentBy: {
      type: String,
      ref: "employees",
      required: true,
    },
    sentTo: {
      type: String,
      ref: "employees",
      required: true,
    },
    sentOn: {
      type: Date,
      default: Date.now,
    },
    approvedOn: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    rejectedOn: {
      type: Date,
      default: null,
    },
    rejectedBy: {
      type: String,
      default: null,
    },
    employeeID: {
      type: mongoose.Schema.ObjectId,
      ref: "employees",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    projectID: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    oldSummary: {
      type: String,
      required: true,
    },
    newSummary: {
      type: String,
      required: true,
    },
    oldHoursInvested: {
      type: String,
      required: true,
    },
    updatedHoursInvested: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const TaskEdit = mongoose.model("TaskEdit", TaskEditSchema);

module.exports = TaskEdit;
