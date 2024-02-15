const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectManager: {
      type: String,
      ref: "employees",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    assignedDetails: [
      {
        employeeObjectID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employees",
          required: false,
        },
        employeeID: {
          type: String,
          required: false,
        },
        employeeName: {
          type: String,
          required: false,
        },
        assignedOn: {
          type: Date,
          required: false,
        },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("projects", projectSchema);

module.exports = ProjectModel;
