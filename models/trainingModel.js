const mongoose = require("mongoose");

const TrainingSchema = new mongoose.Schema(
  {
    trainingID: {
      type: String,
      required: true,
      unique: true,
    },
    trainingName: {
      type: String,
      minLength: 4,
      maxLength: 100,
      required: true,
      unique: true,
    },
    trainingPDF: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TrainingModel = mongoose.model("trainings", TrainingSchema);

module.exports = TrainingModel;
