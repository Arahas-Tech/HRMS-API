const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const createError = require("../utils/errorHandler");

module.exports.addProject = async (req, res, next) => {
  try {
    let data = req.body;
    const newProject = new ProjectModel(data);

    const existingProject = await ProjectModel.findOne({
      $or: [
        { projectCode: data.projectCode },
        { projectName: data.projectName },
        { projectDescription: data.projectDescription },
      ],
    });

    if (existingProject) {
      return next(createError(400, "Project already exists!"));
    }

    const savedProjectDetails = await newProject.save();
    res.status(200).json({
      message: "Project Added Successfully!",
      data: savedProjectDetails,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.addEmployeeToProject = async (req, res, next) => {
  try {
    const projectCode = req.params.projectCode;
    const employeeData = req.body;

    const existingProject = await ProjectModel.findOne({
      projectCode: projectCode,
      projectAssignedDetails: {
        $elemMatch: {
          employeeID: employeeData.employeeID,
        },
      },
    });

    if (existingProject) {
      return res
        .status(400)
        .json({ message: "Employee already exists in the project" });
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { projectCode: projectCode }, // Search for the project by its unique projectCode
      { $push: { "projectAssignedDetails.employees": employeeData } }, // Push the new employee data to the 'employees' array under 'projectAssignedDetails'
      { new: true } // To return the updated document
    );

    if (!updatedProject) {
      return next(createError(404, "Project not found"));
    }

    res.status(200).json({
      message: "Employee added to project successfully",
      data: updatedProject,
    });
  } catch (error) {
    return next(createError(500, "Failed to add employee to project", error));
  }
};

module.exports.getAllProjects = async (_req, res, next) => {
  try {
    const getAllProjects = await ProjectModel.find();
    return res.status(200).json(getAllProjects);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getProjectDetailByProjectCode = async (req, res, next) => {
  try {
    const projectCode = req.params.id;
    const projectDetails = await ProjectModel.findOne({
      projectCode: projectCode,
    });
    if (!projectDetails) {
      return next(createError(404, "Project Not Found!"));
    }
    return res.status(200).json({
      projectObjectID: projectDetails._id,
      projectName: projectDetails.projectName,
      projectDeadline: projectDetails.projectDeadline,
      projectAllotedDuration: projectDetails.projectAllotedDuration,
      projectManager: projectDetails.projectManager,
    });
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getProjectDetailsByManager = async (req, res, next) => {
  try {
    const projectManagerID = req.params.id;
    const projectDetails = await ProjectModel.find({
      projectManager: projectManagerID,
    });

    if (!projectDetails) {
      return next(createError(404, "No project(s) found!"));
    }

    const projectModifiedDetails = projectDetails?.map((projectDetail) => {
      return {
        projectCode: projectDetail.projectCode,
        projectName: projectDetail.projectName,
      };
    });

    return res.status(200).json(projectModifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getProjectDetailByProjectCodeAndManager = async (
  req,
  res,
  next
) => {
  try {
    const projectCode = req.params.id;
    const projectDetails = await ProjectModel.findOne({
      projectCode: projectCode,
    });

    if (!projectDetails) {
      return next(createError(404, "Project Not Found!"));
    }

    const employeeIDs = projectDetails.projectAssignedDetails.map(
      (projectAssignedDetail) => projectAssignedDetail.employeeID
    );

    const employeeNamePipeline = [
      {
        $match: {
          employeeID: { $in: employeeIDs },
        },
      },
      {
        $project: {
          _id: 0,
          employeeID: 1,
          employeeName: 1,
        },
      },
    ];

    const employeeNames = await EmployeeModel.aggregate(employeeNamePipeline);

    const employeeNamesMap = {};
    employeeNames.forEach((employee) => {
      employeeNamesMap[employee.employeeID] = employee.employeeName;
    });

    const projectAssignedDetailsWithNames =
      projectDetails.projectAssignedDetails.map((projectAssignedDetail) => ({
        employeeID: projectAssignedDetail.employeeID,
        employeeName: employeeNamesMap[projectAssignedDetail.employeeID],
      }));

    return res.status(200).json({
      projectCode: projectDetails.projectCode,
      projectName: projectDetails.projectName,
      projectAssignedDetails: projectAssignedDetailsWithNames,
    });
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.editProject = async (req, res, next) => {
  try {
    let { projectCode, editedProjectDescription } = req.body;

    const editedProjectDetails = await ProjectModel.findOneAndUpdate(
      { projectCode: projectCode },
      {
        $set: {
          projectDescription: editedProjectDescription,
        },
      }
    );

    return res.status(200).json(editedProjectDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.deleteProject = async (req, res, next) => {
  try {
    let projectCode = req.params.id;
    const deletedProject = await ProjectModel.findByIdAndDelete(projectCode);

    return res.status(200).json({
      message: "Project SuccessFully Deleted!",
      data: deletedProject,
    });
  } catch (error) {
    return next(createError(error));
  }
};
