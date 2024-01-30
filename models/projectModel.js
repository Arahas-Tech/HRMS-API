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
    projectStartDate: {
      type: Date,
      required: true,
    },
    projectDeadline: {
      type: Date,
      required: true,
    },
    projectAssignedDetails: [
      {
        employeeObjectID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employees",
          unique: true,
        },
        employeeID: {
          type: String,
          unique: true,
        },
        employeeName: {
          type: String,
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
