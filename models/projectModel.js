const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectCode: {
      type: String,
      unique: true,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    projectManager: {
      type: String,
      ref: "employees",
      required: true,
    },
    projectDeadline: {
      type: Date,
      required: true,
    },
    projectAllotedDuration: {
      type: String,
      required: true,
    },
    projectAssignedDetails: [
      {
        employeeID: {
          type: String,
          ref: "employees",
        },
        employeeWorkingLocation: {
          type: String,
          required: true,
        },
      },
    ],
    projectCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("projects", projectSchema);

module.exports = ProjectModel;
