const mongoose = require("mongoose");

const projectTaskSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "employees",
      required: true,
    },
    projectID: {
      type: String,
      ref: "projects",
      required: true,
    },
    projectTaskSummary: {
      type: String,
      required: true,
    },
    projectTaskEffortsTime: {
      type: String,
    },
    projectTaskEffortDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ProjectTaskModel = mongoose.model("project-tasks", projectTaskSchema);

module.exports = ProjectTaskModel;
