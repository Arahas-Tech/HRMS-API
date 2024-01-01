const EmployeeModel = require("../models/employeeModel");
const DateConverter = require("../utils/DateConverter");
const createError = require("../utils/errorHandler");

const xlsx = require("xlsx");
const bcrypt = require("bcrypt");

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

    const result = await EmployeeModel.aggregate(roleNamePipeline);

    const employeeData = allEmployees.map((employee, index) => {
      const dateOfJoiningInReadableFormat = DateConverter(
        employee.dateOfJoining
      );

      return {
        employeeID: employee.employeeID,
        employeeName: employee.employeeName,
        employeeEmail: employee.employeeEmail,
        employeeRoleID: employee.roleID,
        employeeRoleName: result[index]?.roleName,
        employeeDesignation: employee.employeeDesignation,
        trainingsCompleted: employee.trainingsCompleted,
        dateOfJoining: dateOfJoiningInReadableFormat,
      };
    });

    return res.status(200).json(employeeData);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.addEmployee = async (req, res, next) => {
  try {
    let data = req.body;

    const existingEmployee = await EmployeeModel.findOne({
      $or: [
        { employeeEmail: data.employeeEmail },
        { employeeID: data.employeeID },
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

    return res.status(200).json({
      message: "Employee Successfully Registered!",
      data: savedEmployeeDetails,
    });
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
    console.error(error);
    return res.status(500).send("Error uploading file.");
  }
};

module.exports.editEmployee = async (req, res, next) => {
  try {
    const { employeeID, ...data } = req.body;

    const editedEmployeeDetails = await EmployeeModel.findOneAndUpdate(
      { employeeID: employeeID },
      {
        $set: {
          ...data, // Update all fields
        },
      },
      { new: true } // To get the updated document as a result
    );

    if (!editedEmployeeDetails) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json(editedEmployeeDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
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
