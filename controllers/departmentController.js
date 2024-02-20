const DepartmentModel = require("../models/departmentModel");
const createError = require("../utils/errorHandler");

module.exports.addDepartment = async (req, res, next) => {
  try {
    let data = req.body;
    const newDepartment = new DepartmentModel(data);

    const existingDepartment = await DepartmentModel.findOne({
      $or: [
        { _id: data.departmentID },
        { departmentName: data.departmentName },
      ],
    });

    if (existingDepartment) {
      return next(createError(400, "Department already exists!"));
    }

    const savedDepartmentDetails = await newDepartment.save();
    res.status(200).json({
      message: "Department added successfully!",
      data: savedDepartmentDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.getAllDepartments = async (_req, res, next) => {
  try {
    const getAllDepartment = await DepartmentModel.find();
    return res.status(200).json(getAllDepartment);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.editDepartment = async (req, res, next) => {
  try {
    let { departmentID, editedDepartmentName } = req.body;

    const existingDepartment = await DepartmentModel.find({
      departmentName: editedDepartmentName.trim(),
      _id: { $ne: departmentID }, // Exclude the current record being edited
    });

    // ? Check if existingDepartment array has any elements
    if (existingDepartment && existingDepartment.length > 0) {
      return next(createError(500, "Department already exists"));
    }

    await DepartmentModel.findOneAndUpdate(
      { _id: departmentID },
      {
        $set: {
          departmentName: editedDepartmentName.trim(),
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deleteDepartment = async (req, res, next) => {
  try {
    let departmentID = req.params.id;
    const deletedDepartment = await DepartmentModel.findByIdAndDelete(
      departmentID
    );

    return res.status(200).json({
      message: "Department SuccessFully Deleted!",
      data: deletedDepartment,
    });
  } catch (error) {
    return next(createError(error));
  }
};
