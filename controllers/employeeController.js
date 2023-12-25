const EmployeeModel = require("../models/employeeModel");
const createError = require("../utils/errorHandler");

module.exports.getAllEmployees = async (req, res, next) => {
  try {
    const allEmployees = await EmployeeModel.find();

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
        $unwind: "$roleName",
      },
      {
        $project: {
          _id: 0,
          roleName: "$roleName.roleName",
        },
      },
    ];

    const result = await EmployeeModel.aggregate(roleNamePipeline);

    const employeeData = allEmployees.map((employee, index) => ({
      employeeID: employee.employeeID,
      employeeName: employee.employeeName,
      employeeEmail: employee.employeeEmail,
      employeeRoleID: employee.roleID,
      employeeRoleName: result[index]?.roleName,
      trainingsCompleted: employee.trainingsCompleted,
    }));

    return res.status(200).json(employeeData);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.addEmployee = async (req, res, next) => {
  try {
    let data = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.employeePassword, salt);
    data.employeePassword = hashedPassword;
    const newEmployeeDetails = new EmployeeModel(data);

    const savedEmployeeDetails = await newEmployeeDetails.save();

    return res.status(200).json({
      message: "Employee SuccessFully Registered!",
      data: savedEmployeeDetails,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.deleteEmployee = async (req, res, next) => {
  try {
    let employeeID = req.params.id;
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeID);

    return res.status(200).json({
      message: "Employee SuccessFully Removed!",
      data: deletedEmployee,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.updateTraining = async (req, res, next) => {
  try {
    let employeeID = req.params.id;
    let data = req.body;

    console.log(employeeID, data);
    // const deletedEmployee = await EmployeeModel.findOneAndUpdate(
    //   {_id:employeeID},
    //   {$push:{"skills":"Sports"}});

    // return res.status(200).json({
    //   message: "Employee SuccessFully Removed!",
    //   data: deletedEmployee,
    // });
  } catch (error) {
    return next(createError(error));
  }
};
