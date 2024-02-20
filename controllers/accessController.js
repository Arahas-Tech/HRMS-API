const AccessModel = require("../models/accessModel");
const createError = require("../utils/errorHandler");

module.exports.createAccess = async (req, res, next) => {
  try {
    let data = req.body;
    const newAccess = new AccessModel(data);

    const existingAccess = await AccessModel.findOne({
      accessID: data.accessID,
    });

    if (existingAccess) {
      return next(createError(400, "Access already exists!"));
    }

    const savedAccessDetails = await newAccess.save();
    res.status(200).json({
      message: "Access added successfully!",
      data: savedAccessDetails,
    });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
};

module.exports.fetchAccesses = async (_req, res, next) => {
  try {
    const allAccesses = await AccessModel.find();
    return res.status(200).json(allAccesses);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.activateAccess = async (req, res, next) => {
  try {
    let { accessID, editedAccessName } = req.body;

    const existingAccess = await AccessModel.find({
      accessName: editedAccessName.trim(),
      _id: { $ne: accessID }, // Exclude the current record being edited
    });

    // ? Check if existingAccess array has any elements
    if (existingAccess && existingAccess.length > 0) {
      return next(createError(500, "Access already exists"));
    }

    await AccessModel.findOneAndUpdate(
      { _id: accessID },
      {
        $set: {
          accessName: editedAccessName,
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deactivateAccess = async (req, res, next) => {
  try {
    let { accessID, editedAccessName } = req.body;

    const existingAccess = await AccessModel.find({
      accessName: editedAccessName.trim(),
      _id: { $ne: accessID }, // Exclude the current record being edited
    });

    // ? Check if existingAccess array has any elements
    if (existingAccess && existingAccess.length > 0) {
      return next(createError(500, "Access already exists"));
    }

    await AccessModel.findOneAndUpdate(
      { _id: accessID },
      {
        $set: {
          accessName: editedAccessName,
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deleteAccess = async (req, res, next) => {
  try {
    let accessID = req.params.id;
    const deletedAccess = await AccessModel.findByIdAndDelete(accessID);

    return res.status(200).json({
      message: "Access successFully deleted!",
      data: deletedAccess,
    });
  } catch (error) {
    return next(createError(error));
  }
};
