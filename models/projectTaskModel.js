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
    projectTaskSummary: {
      type: String,
      required: true,
    },
    projectTaskEffortsTime: {
      type: String,
      required: true,
    },
    projectTaskEffortDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectTaskModel = mongoose.model("project-tasks", projectTaskSchema);

module.exports = ProjectTaskModel;
