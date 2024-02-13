const mongoose = require("mongoose");

const projectTaskSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    projectID: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    hoursInvested: {
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

const ProjectTaskModel = mongoose.model("project-tasks", projectTaskSchema);

module.exports = ProjectTaskModel;
