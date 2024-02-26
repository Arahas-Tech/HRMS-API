const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const convertDate = require("../utils/DateConverter");
const createError = require("../utils/errorHandler");

module.exports.addProject = async (req, res, next) => {
  try {
    let data = req.body;

    const newProject = new ProjectModel(data);

    const existingProject = await ProjectModel.findOne({
      $or: [{ code: data?.code.trim() }, { name: data?.name.trim() }],
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
    const code = req.params.code;
    const { data } = req.body;
    const totalRecords = data.length;

    for (const employee of data) {
      const existingInProject = await ProjectModel.findOne({
        code: code,
        assignedDetails: {
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
          { code: code }, // Search for the project by its unique code
          { $push: { assignedDetails: employee } } // Push the new employees data to the 'assignedDetails'
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

module.exports.removeEmployeeFromProject = async (req, res, next) => {
  try {
    const code = req.params.code;
    const { data } = req.body;
    const totalRecords = data.length;

    for (const employee of data) {
      await ProjectModel.findOne({
        code: code,
        assignedDetails: {
          $elemMatch: {
            employeeObjectID: employee.employeeObjectID,
          },
        },
      });

      const updatedProject = await ProjectModel.findOneAndUpdate(
        { code: code }, // Search for the project by its unique code
        { $pull: { assignedDetails: employee } } // Pull the new employees data to the 'assignedDetails'
      );

      if (!updatedProject) {
        return next(createError(404, "Project not found"));
      }
    }

    res.status(200).json({
      message: `${
        totalRecords >= 2 ? "Employees" : "Employee"
      }  removed from project successfully`,
    });
  } catch (error) {
    return next(createError(500, "Failed to delete employee from project"));
  }
};

module.exports.getAllProjects = async (_req, res, next) => {
  try {
    const allProjects = await ProjectModel.find();

    if (!allProjects) {
      return next(createError(404, "No projects found"));
    }

    const projectModifiedDetails = allProjects.map((data) => {
      return {
        code: data.code,
        name: data.name,
        description: data.description,
        projectManager: data.projectManager,
        startDate: convertDate(data.startDate),
        endDate: convertDate(data.endDate),
        assignedDetails: data.assignedDetails,
        isCompleted: data.isCompleted,
      };
    });

    return res.status(200).json(projectModifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.fetchProjectsCount = async (req, res, next) => {
  try {
    const { employee } = req.query;

    let projectsCount;

    if (employee) {
      projectsCount = await ProjectModel.countDocuments({
        "assignedDetails.employeeObjectID": employee,
      });
    } else {
      projectsCount = await ProjectModel.countDocuments();
    }

    return res.status(200).json(projectsCount);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getAllProjectsByEmployee = async (req, res, next) => {
  try {
    const employeeID = req.query.employeeID;

    const allProjectsOfEmployee = await ProjectModel.find({
      "assignedDetails.employeeID": employeeID,
    });

    if (!allProjectsOfEmployee) {
      return next(createError(404, "No projects found"));
    }

    const projectModifiedDetails = allProjectsOfEmployee.map((data) => {
      return {
        code: data.code,
        name: data.name,
        isCompleted: data.isCompleted,
        endDate: convertDate(data.endDate),
      };
    });

    return res.status(200).json(projectModifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.fetchRMProjects = async (req, res, next) => {
  try {
    const employeeID = req.query.employeeID;

    const allProjectsOfEmployee = await ProjectModel.find({
      "assignedDetails.employeeID": employeeID,
    });

    if (!allProjectsOfEmployee) {
      return next(createError(404, "No projects found"));
    }

    const projectModifiedDetails = allProjectsOfEmployee.map((data) => {
      return {
        code: data.code,
        name: data.name,
        startDate: convertDate(data.startDate),
        endDate: convertDate(data.endDate),
        assignedDetails: data.assignedDetails,
      };
    });

    return res.status(200).json(projectModifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getProjectDetailByProjectCode = async (req, res, next) => {
  try {
    const code = req.params.id;
    const projectDetails = await ProjectModel.findOne({
      code: code,
    });

    if (!projectDetails) {
      return next(createError(404, "Project Not Found!"));
    }

    // Find project manager details
    const projectManager = await EmployeeModel.findOne({
      employeeId: projectDetails.projectManager,
    });

    return res.status(200).json({
      name: projectDetails.name,
      endDate: convertDate(projectDetails.endDate),
      projectAllotedDuration: projectDetails.projectAllotedDuration,
      projectManager: projectManager.employeeName,
    });
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
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
        code: projectDetail.code,
        name: projectDetail.name,
        assignedDetails: projectDetail.assignedDetails,
      };
    });

    return res.status(200).json(projectModifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getAllProjectsDetailsByManager = async (req, res, next) => {
  try {
    const managerID = req.params.managerID;
    const allProjects = await ProjectModel.find({
      projectManager: managerID,
    });

    const modifiedDetails = allProjects.map((project) => ({
      code: project.code,
      name: project.name,
      projectManager: project.projectManager,
      startDate: convertDate(project.startDate),
      endDate: convertDate(project.endDate),
      isCompleted: project.isCompleted,
      assignedDetails: project.assignedDetails,
    }));

    return res.status(200).json(modifiedDetails);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.getProjectDetailByProjectCodeAndManager = async (
  req,
  res,
  next
) => {
  try {
    const code = req.params.id;
    const projectDetails = await ProjectModel.findOne({
      code: code,
    });

    if (!projectDetails) {
      return next(createError(404, "Project Not Found!"));
    }

    const employeeIDs = projectDetails.assignedDetails.map(
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

    const assignedDetailsWithNames = projectDetails.assignedDetails.map(
      (projectAssignedDetail) => ({
        employeeObjectID: projectAssignedDetail.employeeObjectID,
        employeeID: projectAssignedDetail.employeeID,
        employeeName: employeeNamesMap[projectAssignedDetail.employeeID],
      })
    );

    return res.status(200).json({
      code: projectDetails.code,
      name: projectDetails.name,
      assignedDetails: assignedDetailsWithNames,
    });
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.editProject = async (req, res, next) => {
  try {
    const code = req.params.code;
    const { updatedProjectName, updatedProjectDescription, updatedDeadline } =
      req.body;

    const existingProject = await ProjectModel.find({
      name: updatedProjectName.trim(),
      code: { $ne: code }, // Exclude the current record being edited
    });

    // ? Check if existingProject array has any elements
    if (existingProject && existingProject.length > 0) {
      return next(createError(500, "Project already exists"));
    }

    await ProjectModel.findOneAndUpdate(
      { code: code },
      {
        $set: {
          name: updatedProjectName,
          description: updatedProjectDescription,
          endDate: updatedDeadline,
          isCompleted:
            new Date(updatedDeadline).getTime() ===
            new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
        },
      }
    );

    return res.status(200).json("Updated project details successfully");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deleteProject = async (req, res, next) => {
  try {
    let code = req.params.id;
    const deletedProject = await ProjectModel.findByIdAndDelete(code);

    return res.status(200).json({
      message: "Project SuccessFully Deleted!",
      data: deletedProject,
    });
  } catch (error) {
    return next(createError(error));
  }
};
