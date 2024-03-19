const EmployeeModel = require("../models/employeeModel");
const DepartmentModel = require("../models/departmentModel");
const DateConverter = require("../utils/DateConverter");
const createError = require("../utils/errorHandler");

const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");
const ProjectModel = require("../models/projectModel");

module.exports.getAllEmployees = async (_req, res, next) => {
  try {
    // Fetching only active employees
    const allEmployees = await EmployeeModel.find({ isActive: true });

    // Aggregation pipelines for fetching additional details
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
          roleID: 1,
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
          _id: "$departmentNamesArray._id",
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
          _id: "$designationNamesArray._id",
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
          _id: "$stateNamesArray._id",
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
          _id: "$cityNamesArray._id",
          cityName: "$cityNamesArray.cityName",
        },
      },
    ];

    // Fetching additional details using the pipelines
    const [
      roleNames,
      departmentNames,
      designationNames,
      stateNames,
      cityNames,
    ] = await Promise.all([
      EmployeeModel.aggregate(roleNamePipeline),
      EmployeeModel.aggregate(departmentNamePipeline),
      EmployeeModel.aggregate(designationNamePipeline),
      EmployeeModel.aggregate(stateNamePipeline),
      EmployeeModel.aggregate(cityNamePipeline),
    ]);

    // Mapping the employee data
    const employeeData = allEmployees
      .map((employee) => {
        const dateOfJoiningInReadableFormat = DateConverter(
          employee.dateOfJoining
        );

        return employee.roleID !== "ATPL-ADMIN"
          ? {
              employeeObjectID: employee._id,
              employeeID: employee.employeeID,
              employeeName: employee.employeeName,
              employeeEmail: employee.employeeEmail,
              employeeRoleID: employee.roleID,
              employeeRoleName: roleNames.find(
                (role) => role.roleID === employee.roleID
              )?.roleName,
              employeeDepartment: departmentNames.find((department) =>
                department._id.equals(employee.departmentID)
              )?.departmentName,
              employeeDesignation: designationNames.find((designation) =>
                designation._id.equals(employee.employeeDesignation)
              )?.designationName,
              employeeWorkingState: stateNames.find((state) =>
                state._id.equals(employee.employeeWorkingState)
              )?.stateName,
              employeeWorkingCity: cityNames.find((city) =>
                city._id.equals(employee.employeeWorkingLocation)
              )?.cityName,
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

module.exports.fetchEmployeeCount = async (req, res, next) => {
  try {
    const { employee, project } = req.query;

    let allEmployeeCount;

    if (employee) {
      allEmployeeCount = await EmployeeModel.countDocuments({
        $and: [{ isActive: true }, { _id: employee }],
      });
    } else if (project) {
      const projects = await ProjectModel.find({
        code: project,
      });

      allEmployeeCount = projects[0].assignedDetails.length;
    } else {
      allEmployeeCount = await EmployeeModel.countDocuments({
        $and: [{ isActive: true }, { roleID: { $ne: "ATPL-ADMIN" } }],
      });
    }

    return res.status(200).json(allEmployeeCount);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getAllEmployeesForManager = async (_req, res, next) => {
  try {
    const allEmployees = await EmployeeModel.find({
      $and: [
        {
          roleID: "ATPL-Employee",
        },
        {
          isActive: true,
        },
      ],
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

module.exports.fetchEmployeeUnderRM = async (req, res, next) => {
  const reportingManager = req.query.rm;

  try {
    const allEmployees = await EmployeeModel.find({
      $and: [
        {
          reportingManager: reportingManager,
        },
        {
          isActive: true,
        },
      ],
    });

    const employeeData = allEmployees.map((employee) => {
      return {
        employeeObjectID: employee._id,
        employeeID: employee.employeeID,
        employeeName: employee.employeeName,
      };
    });

    return res.status(200).json(employeeData);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getAllManagers = async (_req, res, next) => {
  try {
    const allManagers = await EmployeeModel.find({
      $and: [
        {
          roleID: "ATPL-PM",
        },
        {
          isActive: true,
        },
      ],
    });

    const managerData = allManagers.map((manager) => {
      return {
        managerID: manager.employeeID,
        managerName: manager.employeeName,
      };
    });

    return res.status(200).json(managerData);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getEmployeeByID = async (req, res, next) => {
  try {
    const employeeID = req.query.employeeID;

    const aggregationPipeline = [
      {
        $match: { employeeID },
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
          employeeID: 1,
          employeeName: 1,
          employeeEmail: 1,
          roleID: 1,
          accessID: 1,
          departmentID: 1,
          reportingManager: 1,
          employeeDesignation: 1,
          employeeWorkingState: 1,
          employeeWorkingLocation: 1,
        },
      },
    ];

    const employeeDetails = await EmployeeModel.aggregate(aggregationPipeline);

    return res.status(200).json(employeeDetails[0]);
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
      item.dateOfJoining = new Date(
        (item.dateOfJoining - 25569) * 86400 * 1000
      ).toISOString();

      const newEmployeeDetails = new EmployeeModel(item);

      const savedEmployeeDetails = await newEmployeeDetails.save();
      if (!savedEmployeeDetails) {
        return next(createError(500, "Error saving details!"));
      }
    }

    return res.status(200).send("File uploaded successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error uploading file.");
  }
};

module.exports.editEmployee = async (req, res, next) => {
  try {
    const { employeeID, employeeName, ...data } = req.body;

    // Check if another employee with the same name exists
    const existingEmployee = await EmployeeModel.findOne({
      employeeName: employeeName.trim(),
      employeeID: { $ne: employeeID }, // Exclude the current employee being edited
    });

    if (existingEmployee) {
      return res
        .status(400)
        .json("Another employee with the same name already exists");
    }

    const editedEmployeeDetails = await EmployeeModel.findOneAndUpdate(
      { employeeID: employeeID },
      {
        $set: {
          ...data, // Update rest fields
        },
      }
    );

    if (!editedEmployeeDetails) {
      return res.status(404).json("Employee not found");
    }

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.deleteEmployee = async (req, res, next) => {
  try {
    let employeeID = req.params.id;
    const deletedEmployee = await EmployeeModel.findOneAndUpdate(
      { employeeID: employeeID },
      {
        isActive: false,
      }
    );

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
