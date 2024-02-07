const EmployeeModel = require("../models/employeeModel");
const DepartmentModel = require("../models/departmentModel");
const DateConverter = require("../utils/DateConverter");
const createError = require("../utils/errorHandler");

const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");

module.exports.getAllEmployees = async (_req, res, next) => {
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

    const departmentNamePipeline = [
      {
        $lookup: {
          from: "departments",
          localField: "departmentID",
          foreignField: "_id",
          as: "departmentNamesArray",
        },
      },
      {
        $unwind: "$departmentNamesArray",
      },
      {
        $project: {
          _id: 0,
          departmentName: "$departmentNamesArray.departmentName",
        },
      },
    ];

    const designationNamePipeline = [
      {
        $lookup: {
          from: "designations",
          localField: "employeeDesignation",
          foreignField: "_id",
          as: "designationNamesArray",
        },
      },
      {
        $unwind: "$designationNamesArray",
      },
      {
        $project: {
          _id: 0,
          designationName: "$designationNamesArray.designationName",
        },
      },
    ];

    const stateNamePipeline = [
      {
        $lookup: {
          from: "states",
          localField: "employeeWorkingState",
          foreignField: "_id",
          as: "stateNamesArray",
        },
      },
      {
        $unwind: "$stateNamesArray",
      },
      {
        $project: {
          _id: 0,
          stateName: "$stateNamesArray.stateName",
        },
      },
    ];

    const cityNamePipeline = [
      {
        $lookup: {
          from: "cities",
          localField: "employeeWorkingLocation",
          foreignField: "_id",
          as: "cityNamesArray",
        },
      },
      {
        $unwind: "$cityNamesArray",
      },
      {
        $project: {
          _id: 0,
          cityName: "$cityNamesArray.cityName",
        },
      },
    ];

    const roleNames = await EmployeeModel.aggregate(roleNamePipeline);

    const departmentNames = await EmployeeModel.aggregate(
      departmentNamePipeline
    );

    const designationNames = await EmployeeModel.aggregate(
      designationNamePipeline
    );

    const stateNames = await EmployeeModel.aggregate(stateNamePipeline);

    const cityNames = await EmployeeModel.aggregate(cityNamePipeline);

    const employeeData = allEmployees
      .map((employee, index) => {
        const dateOfJoiningInReadableFormat = DateConverter(
          employee.dateOfJoining
        );

        return employee.roleID !== "ATPL-ADMIN"
          ? {
              employeeID: employee.employeeID,
              employeeName: employee.employeeName,
              employeeEmail: employee.employeeEmail,
              employeeRoleID: employee.roleID,
              employeeRoleName: roleNames[index]?.roleName,
              employeeDepartment: departmentNames[index]?.departmentName,
              employeeDesignation: designationNames[index]?.designationName,
              employeeWorkingState: stateNames[index]?.stateName,
              employeeWorkingCity: cityNames[index]?.cityName,
              trainingsCompleted: employee.trainingsCompleted,
              dateOfJoining: dateOfJoiningInReadableFormat,
            }
          : null;
      })
      .filter((data) => data !== null);

    return res.status(200).json(employeeData);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getAllEmployeesForManager = async (_req, res, next) => {
  try {
    const allEmployees = await EmployeeModel.find({
      roleID: "ATPL-Employee",
    });

    const employeeData = allEmployees.map((employee) => {
      return {
        employeeObjectID: employee._id,
        employeeID: employee.employeeID,
        employeeName: employee.employeeName,
        employeeWorkingState: employee.employeeWorkingState,
        employeeWorkingLocation: employee.employeeWorkingLocation,
      };
    });

    return res.status(200).json(employeeData);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getEmployeeByID = async (req, res, next) => {
  try {
    const { employeeID } = req.body;
    const filteredEmployee = await EmployeeModel.findOne({
      employeeID: employeeID,
    });

    return res.status(200).json(filteredEmployee);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.addEmployee = async (req, res, next) => {
  try {
    let data = req.body;

    const existingEmployee = await EmployeeModel.findOne({
      $or: [
        { employeeEmail: data.employeeEmail?.toLowerCase() },
        { employeeID: data.employeeID?.toLowerCase() },
      ],
    });

    if (existingEmployee) {
      return next(createError(400, "Email or Employee ID already exists!"));
    }

    if (!data) {
      return next(createError(400, "Invalid data!"));
    }

    const salt = await bcrypt.genSalt();
    if (!salt) {
      return next(createError(500, "Error generating salt!"));
    }

    const hashedPassword = await bcrypt.hash(data.employeePassword, salt);
    if (!hashedPassword) {
      return next(createError(500, "Error hashing password!"));
    }

    data.employeePassword = hashedPassword;
    const newEmployeeDetails = new EmployeeModel(data);

    const savedEmployeeDetails = await newEmployeeDetails.save();
    if (!savedEmployeeDetails) {
      return next(createError(500, "Error saving details!"));
    }

    return res.status(200).json("Employee Successfully Registered!");
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.bulkAddEmployees = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Parse the uploaded Excel file using xlsx
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel data to JSON format
    const data = xlsx.utils.sheet_to_json(worksheet);

    for (const item of data) {
      const existingEmployee = await EmployeeModel.findOne({
        $or: [
          { employeeEmail: item.employeeEmail },
          { employeeID: item.employeeID },
        ],
      });

      if (existingEmployee) {
        return next(createError(400, "Email or Employee ID already exists!"));
      }

      if (!item) {
        return next(createError(400, "Invalid data!"));
      }

      const salt = await bcrypt.genSalt();
      if (!salt) {
        return next(createError(500, "Error generating salt!"));
      }

      const hashedPassword = await bcrypt.hash(
        item.employeePassword.toString(),
        salt
      );
      if (!hashedPassword) {
        return next(createError(500, "Error hashing password!"));
      }

      item.employeePassword = hashedPassword;
      const newEmployeeDetails = new EmployeeModel(item);

      const savedEmployeeDetails = await newEmployeeDetails.save();
      if (!savedEmployeeDetails) {
        return next(createError(500, "Error saving details!"));
      }
    }

    return res.status(200).send("File uploaded successfully.");
  } catch (error) {
    return res.status(500).send("Error uploading file.");
  }
};

module.exports.editEmployee = async (req, res, next) => {
  try {
    const { employeeID, employeeName, ...data } = req.body;

    // Check if another employee with the same name exists
    const existingEmployee = await EmployeeModel.findOne({
      employeeName: employeeName,
      employeeID: { $ne: employeeID }, // Exclude the current employee being edited
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Another employee with the same name already exists",
      });
    }

    const editedEmployeeDetails = await EmployeeModel.findOneAndUpdate(
      { employeeID: employeeID },
      {
        $set: {
          ...data, // Update all fields
        },
      }
    );

    if (!editedEmployeeDetails) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.deleteEmployee = async (req, res, next) => {
  try {
    let employeeID = req.params.id;
    const deletedEmployee = await EmployeeModel.findOneAndDelete({
      employeeID: employeeID,
    });

    return res.status(200).json({
      message: "Employee SuccessFully Removed!",
      data: deletedEmployee,
    });
  } catch (error) {
    return next(createError(500, "Something went wrong!"));
  }
};

module.exports.updateTraining = async (req, res, next) => {
  try {
    let employeeID = req.params.id;
    let data = req.body;

    const updatedEmployeeTrainings = await EmployeeModel.findOneAndUpdate(
      { employeeID: employeeID },
      {
        $push: {
          trainingsCompleted: data,
        },
      }
    );

    return res.status(200).json({
      message: "Training Successfully Completed and Added!",
      data: updatedEmployeeTrainings,
    });
  } catch (error) {
    return next(createError(error));
  }
};
