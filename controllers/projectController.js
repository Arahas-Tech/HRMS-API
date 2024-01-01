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
    next(createError(error));
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
