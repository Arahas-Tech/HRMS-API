const DesignationModel = require("../models/designationModel");
const createError = require("../utils/errorHandler");

module.exports.createDesignation = async (req, res, next) => {
  try {
    let data = req.body;

    const existingDesignation = await DesignationModel.findOne({
      designationName: data.designationName,
    });

    if (existingDesignation) {
      return next(createError(400, "Designation already exists!"));
    }

    const newDesignation = new DesignationModel(data);
    const savedDesignationDetails = await newDesignation.save();

    res.status(200).json({
      message: "Designation added successfully!",
      data: savedDesignationDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.fetchDesignations = async (_req, res, next) => {
  try {
    const designations = await DesignationModel.find();
    return res.status(200).json(designations);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.editDesignation = async (req, res, next) => {
  try {
    let { designationID, editedDesignationName } = req.body;

    const existingDesignation = await DesignationModel.find({
      designationName: editedDesignationName.trim(),
      _id: { $ne: designationID }, // Exclude the current record being edited
    });

    // ? Check if existingDesignation array has any elements
    if (existingDesignation && existingDesignation.length > 0) {
      return next(createError(500, "Designation already exists"));
    }

    await DesignationModel.findOneAndUpdate(
      { _id: designationID },
      {
        $set: {
          designationName: editedDesignationName.trim(),
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    console.log(error);
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deleteDesignation = async (req, res, next) => {
  try {
    let designationID = req.params.id;
    const deletedDesignation = await DesignationModel.findByIdAndDelete(
      designationID
    );

    return res.status(200).json({
      message: "Designation successFully deleted!",
      data: deletedDesignation,
    });
  } catch (error) {
    return next(createError(error));
  }
};
