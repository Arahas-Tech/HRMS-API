const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const createError = require("../utils/errorHandler");

module.exports.createTask = async (req, res, next) => {
  try {
    let { tasks } = req.body;

    const newProjectTasks = [];

    for (const task of tasks) {
      const existingTaskForDate = await TaskModel.findOne({
        date: task.date,
        projectID: task.projectID,
        employeeID: task.employeeID,
      });

      if (existingTaskForDate) {
        return next(createError(400, `Tasks for ${task.date} already exists!`));
      }

      const newTask = await TaskModel.create(task);
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

module.exports.fetchTaskByDate = async (req, res, next) => {
  try {
    const { taskDate } = req.body;

    const startOfDay = new Date(taskDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(taskDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const projectTaskEffortDetails = await TaskModel.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      employeeID: req.body.employeeID,
    });

    if (!projectTaskEffortDetails) {
      return res.status(404).json({
        message: `Project Task Efforts Not Found for ${date}
        `,
      });
    }

    const projectTaskEffortDetailsModified = projectTaskEffortDetails.map(
      (projectTask) => {
        return {
          projectID: projectTask.projectID,
          summary: projectTask.summary,
          hoursInvested: projectTask.hoursInvested,
          date: projectTask.date,
        };
      }
    );

    return res.status(200).json(projectTaskEffortDetailsModified);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchTaskByDates = async (req, res, next) => {
  try {
    const { employeeID, startDate, endDate } = req.body;

    const projectTaskDetails = await TaskModel.find({
      $and: [
        {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        { employeeID: employeeID },
      ],
    });

    if (!projectTaskDetails) {
      return next(
        createError(404, `Project Tasks not found for ${employeeID}`)
      );
    }

    const projectTaskDetailsModified = await Promise.all(
      projectTaskDetails.map(async (projectTask) => {
        const projectNamePipeline = [
          {
            $match: {
              code: projectTask.projectID,
            },
          },
          {
            $project: {
              _id: 0,
              name: 1,
            },
          },
        ];

        try {
          const result = await ProjectModel.aggregate(projectNamePipeline);

          return {
            projectName: result[0]?.name,
            date: projectTask.date,
            summary: projectTask.summary,
            hoursInvested: projectTask.hoursInvested,
          };
        } catch (error) {
          return next(createError(500, "Something went wrong"));
        }
      })
    );

    const sortedTaskData = projectTaskDetailsModified?.sort(function (a, b) {
      return Date.parse(a.date) - Date.parse(b.date);
    });

    return res.status(200).json(sortedTaskData);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.getAllProjectTaskByProjectAndEmployee = async (
  req,
  res,
  next
) => {
  try {
    const { projectCode, employeeID, startDate, endDate } = req.body;

    const projectTaskDetails = await TaskModel.find({
      $and: [
        {
          date: {
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
        summary: projectTask.summary,
        hoursInvested: projectTask.hoursInvested,
        date: projectTask.date,
      };
    });

    return res.status(200).json(projectTaskDetailsModified);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.getAllProjectTaskByProject = async (req, res, next) => {
  try {
    const { projectCode, startDate, endDate } = req.body;

    const projectTaskDetails = await TaskModel.find({
      $and: [
        {
          date: {
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
      return res.status(404).json(`Project Tasks not found ${projectCode}`);
    }

    const projectTaskDetailsModified = await Promise.all(
      projectTaskDetails.map(async (projectTask) => {
        const { employeeID } = projectTask;

        try {
          const employeeDetails = await EmployeeModel.findById(employeeID);
          const employeeName = employeeDetails.employeeName;

          return {
            employeeID: projectTask.employeeID,
            employeeName: employeeName,
            projectCode: projectTask.projectID,
            summary: projectTask.summary,
            hoursInvested: projectTask.hoursInvested,
            date: projectTask.date,
          };
        } catch (error) {
          console.error(
            `Error fetching employee details for ID ${employeeID}:`,
            error
          );
          return projectTask;
        }
      })
    );

    return res.status(200).json(projectTaskDetailsModified);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};
