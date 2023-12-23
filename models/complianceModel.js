const mongoose = require("mongoose");

const TrainingSchema = new mongoose.Schema({
  trainingID: {
    type: String,
    minlength: 6,
    maxlength: 25,
    unique: true,
    required: true,
  },
  trainingName: {
    type: String,
    minlength: 2,
    maxlength: 25,
    unique: true,
    required: true,
  },
  trainingStatus: {
    type: Boolean,
    default: false,
  },
  trainingCompletedBy: {
    type: String,
    minlength: 2,
    maxlength: 25,
    unique: true,
    required: true,
  },
  trainingCompletedOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const TrainingModel = mongoose.model("training", TrainingSchema);

module.exports = TrainingModel;
