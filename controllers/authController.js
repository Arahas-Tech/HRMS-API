const EmployeeModel = require("../models/employeeModel");
const createError = require("../utils/errorHandler");

const bcrypt = require("bcrypt");
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
    await currentEmployee.save(); // Save the updated employee with accessToken

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

    const roleNamePipeline = [
      {
        $lookup: {
          from: "roles",
          localField: "roleID",
          foreignField: "roleID",
          as: "roleName",
        },
      },
      {
        $unwind: "$roleName", // Corrected to reference "roleName"
      },
      {
        $project: {
          _id: 0, // Exclude the _id field if not needed
          roleName: "$roleName.roleName",
        },
      },
    ];

    const result = await EmployeeModel.aggregate(roleNamePipeline);

    return res.status(200).json({
      employeeObjectID: currentUser?._id,
      employeeID: currentUser?.employeeID,
      employeeName: currentUser?.employeeName,
      employeeEmail: currentUser?.employeeEmail,
      employeeDesignation: currentUser?.employeeDesignation,
      employeeWorkingState: currentUser?.employeeWorkingState,
      employeeWorkingLocation: currentUser?.employeeWorkingLocation,
      employeeRoleID: currentUser?.roleID,
      employeeRoleName: result[0]?.roleName,
      employeeDOJ: currentUser?.dateOfJoining,
      trainingsCompleted: currentUser?.trainingsCompleted,
    });
  } catch (error) {
    return next(createError(500, "Something went wrong at server's end!"));
  }
};

module.exports.logout = async (_req, res, _next) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Logout Success!" });
};
