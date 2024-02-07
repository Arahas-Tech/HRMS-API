const DepartmentModel = require("../models/departmentModel");
const EmployeeModel = require("../models/employeeModel");
const createError = require("../utils/errorHandler");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  try {
    let { employeeEmail, employeePassword: employeeEnteredPassword } = req.body;

    if (!employeeEmail || !employeeEnteredPassword)
      return next(createError(400, "All fields are required!"));

    const currentEmployee = await EmployeeModel.findOne({
      employeeEmail,
    });

    if (!currentEmployee) return next(createError(404, "Employee Not Found!"));

    const comparedPassword = await bcrypt.compare(
      employeeEnteredPassword,
      currentEmployee.employeePassword
    );

    if (!comparedPassword)
      return next(createError(400, "Wrong Credentials! Please re-try!"));

    const token = jwt.sign(
      {
        employeeID: currentEmployee.employeeID,
        roleID: currentEmployee.roleID,
      },
      process.env.JWT_SECRET
    );

    // Update the currentEmployee's accessToken field
    currentEmployee.accessToken = token;
    // Save the updated employee
    await currentEmployee.save();

    res.status(200).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createError(500, "Something went wrong at server's end!"));
  }
};

module.exports.getUserDetailsFromToken = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return next(createError(400, "Access Token is missing"));
    }

    const currentUser = await EmployeeModel.findOne({ accessToken });

    if (!currentUser) {
      return next(createError(404, "Incorrect Token or User not Found!"));
    }

    const aggregationPipeline = [
      {
        $match: { accessToken },
      },
      {
        $lookup: {
          from: "roles",
          localField: "roleID",
          foreignField: "roleID",
          as: "role",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "departmentID",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "employeeDesignation",
          foreignField: "_id",
          as: "designation",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "employeeWorkingState",
          foreignField: "_id",
          as: "state",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "employeeWorkingLocation",
          foreignField: "_id",
          as: "city",
        },
      },
      {
        $project: {
          _id: 0,
          employeeObjectID: "$_id",
          employeeID: 1,
          employeeName: 1,
          employeeEmail: 1,
          employeeRoleID: "$roleID",
          employeeRoleName: "$role.roleName",
          employeeDepartment: "$department.departmentName",
          employeeDesignation: "$designation.designationName",
          employeeWorkingState: "$state.stateName",
          employeeWorkingLocation: "$city.cityName",
          employeeDOJ: "$dateOfJoining",
          trainingsCompleted: 1,
        },
      },
    ];

    const userDetails = await EmployeeModel.aggregate(aggregationPipeline);

    if (!userDetails || userDetails.length === 0) {
      return next(createError(404, "User details not found"));
    }

    return res.status(200).json(userDetails[0]);
  } catch (error) {
    return next(createError(500, "Something went wrong at server's end!"));
  }
};

module.exports.logout = async (_req, res, _next) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Logout Success!" });
};
