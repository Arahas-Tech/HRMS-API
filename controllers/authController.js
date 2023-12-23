const EmployeeModel = require("../models/employeeModel");
const RolesModel = require("../models/rolesModel");
const createError = require("../utils/errorHandler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    let data = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.employeePassword, salt);
    data.employeePassword = hashedPassword;
    const newEmployeeDetails = new EmployeeModel(data);

    const savedEmployeeDetails = await newEmployeeDetails.save();

    res.status(200).json({
      message: "Employee SuccessFully Registered",
      data: savedEmployeeDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    let { employeeEmail, employeePassword: employeeEnteredPassword } = req.body;
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
        id: currentEmployee._id,
        employeeID: currentEmployee.employeeID,
        roleID: currentEmployee.roleID,
      },
      process.env.JWT_SECRET
    );

    // Update the currentEmployee's accessToken field
    currentEmployee.accessToken = token;
    await currentEmployee.save(); // Save the updated employee with accessToken

    res
      .cookie("accessToken", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      })
      .status(200)
      .json({
        accessToken: token,
      });
  } catch (error) {
    return next(createError(error));
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
      next(createError(404, "Incorrect Token or User not Found!"));
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
      employeeID: currentUser.employeeID,
      employeeName: currentUser.employeeName,
      employeeEmail: currentUser.employeeEmail,
      employeeRoleID: currentUser.roleID,
      employeeRoleName: result[0]?.roleName,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.logout = async (req, res, next) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Logout Success!" });
};

module.exports.createRole = async (req, res, next) => {
  try {
    let data = req.body;
    const newRole = new RolesModel(data);
    try {
      const savedRole = await newRole.save();
      res.status(200).json({
        message: "Role Added Successfully!",
        data: savedRole,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (error) {
    next(createError(error));
  }
};

module.exports.getAllRoles = async (req, res, next) => {
  try {
    const allRoles = await RolesModel.find();

    res.status(200).json(allRoles);
  } catch (error) {
    createError(error);
  }
};
