const TrainingModel = require("../models/trainingModel");
const createError = require("../utils/errorHandler");

module.exports.getAllTrainings = async (_req, res, next) => {
  try {
    const getAllTrainings = await TrainingModel.find();

    return res.status(200).json(getAllTrainings);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getAllTrainingsCount = async (_req, res, next) => {
  try {
    const getAllTrainingsCount = (await TrainingModel.find()).length;
    return res.status(200).json(getAllTrainingsCount);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getTrainingsDetailByID = async (req, res, next) => {
  try {
    const trainingID = req.params.id;
    const trainingDetails = await TrainingModel.findById(trainingID);

    return res.status(200).json({
      trainingStringID: trainingDetails.trainingID,
      trainingName: trainingDetails.trainingName,
    });
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.addTrainings = async (req, res, next) => {
  try {
    let data = req.body;
    const trainingDetails = new TrainingModel(data);
    const existingTraining = await TrainingModel.findOne({
      $or: [
        { trainingID: data.trainingID },
        { trainingName: data.trainingName },
      ],
    });

    if (existingTraining) {
      return next(createError(400, "Training already exists!"));
    }

    const savedTrainingDetails = await trainingDetails.save();

    return res.status(200).json({
      message: "Training SuccessFully Added!",
      data: savedTrainingDetails,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.editTraining = async (req, res, next) => {
  try {
    let { trainingID, editedTrainingName } = req.body;

    const editedTrainingDetails = await TrainingModel.findByIdAndUpdate(
      trainingID,
      {
        $set: {
          trainingName: editedTrainingName,
        },
      }
    );

    return res.status(200).json(editedTrainingDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.deleteTraining = async (req, res, next) => {
  try {
    let trainingID = req.params.id;
    const deletedTraining = await TrainingModel.findByIdAndDelete(trainingID);

    return res.status(200).json({
      message: "Training SuccessFully Deleted!",
      data: deletedTraining,
    });
  } catch (error) {
    return next(createError(error));
  }
};
