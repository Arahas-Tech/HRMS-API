const DesignationModel = require("../models/designationModel");
const createError = require("../utils/errorHandler");

module.exports.addDesignation = async (req, res, next) => {
  try {
    let data = req.body;
    const newDesignation = new DesignationModel(data);

    const existingDesignation = await DesignationModel.findOne({
      designationName: data.designationName,
    });

    if (existingDesignation) {
      return next(createError(400, "Designation already exists!"));
    }

    const savedDesignationDetails = await newDesignation.save();
    res.status(200).json({
      message: "Designation added successfully!",
      data: savedDesignationDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.getAllDesignations = async (_req, res, next) => {
  try {
    const getAllDesignation = await DesignationModel.find();
    return res.status(200).json(getAllDesignation);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.editDesignation = async (req, res, next) => {
  try {
    let { designationID, editedDesignationName } = req.body;

    const editedDesignationDetails = await DesignationModel.findOneAndUpdate(
      { _id: designationID },
      {
        $set: {
          designationName: editedDesignationName,
        },
      }
    );

    return res.status(200).json(editedDesignationDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
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
