const TrainingModel = require("../models/trainingModel");
const createError = require("../utils/errorHandler");

module.exports.getAllTrainings = async (_req, res, next) => {
  try {
    const getAllTrainings = await TrainingModel.find();
    res.status(200).json(getAllTrainings);
  } catch (error) {
    next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.addTrainings = async (req, res, next) => {
  try {
    let data = req.body;
    const trainingDetails = new TrainingModel(data);

    const savedTrainingDetails = await trainingDetails.save();

    res.status(200).json({
      message: "Training SuccessFully Added!",
      data: savedTrainingDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.deleteTraining = async (req, res, next) => {
  try {
    let trainingID = req.params.id;
    const deletedTraining = await TrainingModel.findByIdAndDelete(trainingID);

    res.status(200).json({
      message: "Training SuccessFully Deleted!",
      data: deletedTraining,
    });
  } catch (error) {
    next(createError(error));
  }
};
