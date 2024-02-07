const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const createError = require("../utils/errorHandler");

module.exports.addProject = async (req, res, next) => {
  try {
    let data = req.body;

    const newProject = new ProjectModel(data);

    const existingProject = await ProjectModel.findOne({
      $or: [
        { projectCode: data?.projectCode },
        { projectName: data?.projectName },
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
    const { data } = req.body;
    const totalRecords = data.length;

    for (const employee of data) {
      const existingInProject = await ProjectModel.findOne({
        projectCode: projectCode,
        projectAssignedDetails: {
          $elemMatch: {
            employeeObjectID: employee.employeeObjectID,
          },
        },
      });
      if (existingInProject) {
        return next(
          createError(
            400,
            `${
              totalRecords >= 2 ? "Employees" : "Employee"
            }  already assigned to this project`
          )
        );
      } else {
        const updatedProject = await ProjectModel.findOneAndUpdate(
          { projectCode: projectCode }, // Search for the project by its unique projectCode
          { $push: { projectAssignedDetails: employee } } // Push the new employees data to the 'projectAssignedDetails'
        );

        if (!updatedProject) {
          return next(createError(404, "Project not found"));
        }
      }
    }

    res.status(200).json({
      message: `${
        totalRecords >= 2 ? "Employees" : "Employee"
      }  added to project successfully`,
    });
  } catch (error) {
    return next(createError(500, "Failed to add employee to project", error));
  }
};

module.exports.getAllProjectsByEmployee = async (req, res, next) => {
  try {
    const employeeID = req.query.employeeID;

    const getAllProjectsByEmployee = await ProjectModel.find({
      "projectAssignedDetails.employeeID": employeeID,
    });

    if (!getAllProjectsByEmployee) {
      return next(createError(404, "No projects found"));
    }

    const projectModifiedDetails = getAllProjectsByEmployee.map((data) => {
      return {
        projectCode: data.projectCode,
        projectName: data.projectName,
        projectCompleted: data.projectCompleted,
        projectDeadline: data.projectDeadline,
      };
    });

    return res.status(200).json(projectModifiedDetails);
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

    // Find project manager details
    const projectManager = await EmployeeModel.findOne({
      employeeId: projectDetails.projectManager,
    });

    return res.status(200).json({
      projectName: projectDetails.projectName,
      projectDeadline: projectDetails.projectDeadline,
      projectAllotedDuration: projectDetails.projectAllotedDuration,
      projectManager: projectManager.employeeName,
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
        projectAssignedDetails: projectDetail.projectAssignedDetails,
      };
    });

    return res.status(200).json(projectModifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getAllProjectsDetailsByManager = async (req, res, next) => {
  try {
    const managerID = req.params.managerID;
    const getAllProjects = await ProjectModel.find({
      projectManager: managerID,
    });
    return res.status(200).json(getAllProjects);
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
        employeeObjectID: projectAssignedDetail.employeeObjectID,
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
    const projectCode = req.params.projectCode;
    const { updatedProjectName, updatedProjectDescription, updatedDeadline } =
      req.body;

    const editedProjectDetails = await ProjectModel.findOneAndUpdate(
      { projectCode: projectCode },
      {
        $set: {
          projectName: updatedProjectName,
          projectDescription: updatedProjectDescription,
          projectDeadline: updatedDeadline,
          projectCompleted:
            new Date(updatedDeadline).getTime() ===
            new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
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
