const ProjectTaskModel = require("../models/projectTaskModel");
const createError = require("../utils/errorHandler");

module.exports.addProjectTask = async (req, res, next) => {
  try {
    let { tasks } = req.body;

    const newProjectTasks = [];

    for (const task of tasks) {
      const existingTaskForDate = await ProjectTaskModel.findOne({
        projectTaskEffortDate: task.projectTaskEffortDate,
        projectID: task.projectID,
        employeeID: task.employeeID,
      });

      if (existingTaskForDate) {
        return next(
          createError(
            400,
            `Tasks for ${task.projectTaskEffortDate} already exists!`
          )
        );
        break;
      }

      const newTask = await ProjectTaskModel.create(task);
      newProjectTasks.push(newTask);
    }

    return res.status(200).json({
      message: "Project Task Added Successfully!",
      data: newProjectTasks,
    });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports.getProjectTaskByDate = async (req, res, next) => {
  try {
    const { projectTaskEffortDate, employeeID } = req.body;

    const startOfDay = new Date(projectTaskEffortDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(projectTaskEffortDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const projectTaskEffortDetails = await ProjectTaskModel.find({
      projectTaskEffortDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      employeeID: req.body.employeeID,
    });

    if (!projectTaskEffortDetails) {
      return res.status(404).json({
        message: `Project Task Efforts Not Found for ${projectTaskEffortDate}
        `,
      });
    }

    const projectTaskEffortDetailsModified = projectTaskEffortDetails.map(
      (projectTask, index) => {
        return {
          projectID: projectTask.projectID,
          projectTaskSummary: projectTask.projectTaskSummary,
          projectTaskEffortsTime: projectTask.projectTaskEffortsTime,
          projectTaskEffortDate: projectTask.projectTaskEffortDate,
        };
      }
    );

    return res.status(200).json(projectTaskEffortDetailsModified);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getAllProjectTaskByDateRange = async (req, res, next) => {
  try {
    const { employeeID, startDate, endDate } = req.body;

    const projectTaskDetails = await ProjectTaskModel.find({
      $and: [
        {
          projectTaskEffortDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        { employeeID: employeeID },
      ],
    });

    if (!projectTaskDetails) {
      return res.status(404).json({
        message: `Project Tasks not found for ${employeeID}
        `,
      });
    }

    const projectTaskDetailsModified = projectTaskDetails.map((projectTask) => {
      return {
        projectID: projectTask.projectID,
        projectTaskSummary: projectTask.projectTaskSummary,
        projectTaskEffortsTime: projectTask.projectTaskEffortsTime,
        projectTaskEffortDate: projectTask.projectTaskEffortDate,
      };
    });

    return res.status(200).json(projectTaskDetailsModified);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getAllProjectTaskByProjectAndEmployee = async (
  req,
  res,
  next
) => {
  try {
    const { projectCode, employeeID, startDate, endDate } = req.body;

    const projectTaskDetails = await ProjectTaskModel.find({
      $and: [
        {
          projectTaskEffortDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        {
          projectID: projectCode,
        },
        {
          employeeID: employeeID,
        },
      ],
    });

    if (!projectTaskDetails || projectTaskDetails.length === 0) {
      return res.status(404).json({
        message: `Project Tasks not found for employeeID ${employeeID}`,
      });
    }

    const projectTaskDetailsModified = projectTaskDetails.map((projectTask) => {
      return {
        projectID: projectTask.projectID,
        projectTaskSummary: projectTask.projectTaskSummary,
        projectTaskEffortsTime: projectTask.projectTaskEffortsTime,
        projectTaskEffortDate: projectTask.projectTaskEffortDate,
      };
    });

    return res.status(200).json(projectTaskDetailsModified);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.getAllProjectTaskByProject = async (req, res, next) => {
  try {
    const { projectCode, startDate, endDate } = req.body;

    const projectTaskDetails = await ProjectTaskModel.find({
      $and: [
        {
          projectTaskEffortDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        {
          projectID: projectCode,
        },
      ],
    });

    if (!projectTaskDetails || projectTaskDetails.length === 0) {
      return res.status(404).json({
        message: `Project Tasks not found ${projectCode}`,
      });
    }

    const projectTaskDetailsModified = projectTaskDetails.map((projectTask) => {
      return {
        employeeID: projectTask.employeeID,
        projectCode: projectTask.projectID,
        projectTaskSummary: projectTask.projectTaskSummary,
        projectTaskEffortsTime: projectTask.projectTaskEffortsTime,
        projectTaskEffortDate: projectTask.projectTaskEffortDate,
      };
    });

    return res.status(200).json(projectTaskDetailsModified);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};
