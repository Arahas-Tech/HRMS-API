const StateModel = require("../models/stateModel");
const createError = require("../utils/errorHandler");

module.exports.addState = async (req, res, next) => {
  try {
    let data = req.body;
    const newState = new StateModel(data);

    const existingState = await StateModel.findOne({
      stateName: data.stateName,
    });

    if (existingState) {
      return next(createError(400, "State already exists!"));
    }

    const savedStateDetails = await newState.save();
    res.status(200).json({
      message: "State added successfully!",
      data: savedStateDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.getAllStates = async (_req, res, next) => {
  try {
    const getAllState = await StateModel.find();
    return res.status(200).json(getAllState);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.editState = async (req, res, next) => {
  try {
    let { stateID, editedStateName } = req.body;

    const existingState = await StateModel.find({
      stateName: editedStateName.trim(),
      _id: { $ne: stateID }, // Exclude the current record being edited
    });

    // ? Check if existingState array has any elements
    if (existingState && existingState.length > 0) {
      return next(createError(500, "State already exists"));
    }

    await StateModel.findOneAndUpdate(
      { _id: stateID },
      {
        $set: {
          stateName: editedStateName,
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deleteState = async (req, res, next) => {
  try {
    let stateID = req.params.id;
    const deletedState = await StateModel.findByIdAndDelete(stateID);

    return res.status(200).json({
      message: "State successFully deleted!",
      data: deletedState,
    });
  } catch (error) {
    return next(createError(error));
  }
};
