const EmployeeModel = require("../models/employeeModel");
const createError = require("../utils/errorHandler");

module.exports.getAllEmployees = async (req, res, next) => {
  try {
    const allEmployees = await EmployeeModel.find();
    res.status(200).json(allEmployees);
  } catch (error) {
    next(createError(createError(500, `Something went wrong! ${error}`)));
  }
};
