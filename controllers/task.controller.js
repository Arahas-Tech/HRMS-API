const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const { addTimes } = require("../utils/AddTwoStringHours");
const createError = require("../utils/errorHandler");

module.exports.createTask = async (req, res, next) => {
  try {
    const task = req.body;

    if (!task.date || !task.projectID || !task.employeeID || !task.summary) {
      return next(createError(400, "Missing required fields."));
    }

    // ! Check if projectID and employeeID exist
    const existingProject = await ProjectModel.findOne({
      code: task.projectID,
    });
    if (!existingProject) {
      return next(createError(404, "Project not found."));
    }

    const existingEmployee = await EmployeeModel.findById(task.employeeID);
    if (!existingEmployee) {
      return next(createError(404, "Employee not found."));
    }

    // Check if task already exists for the same date, project, and employee
    const existingTaskForDate = await TaskModel.findOne({
      $and: [
        { date: task.date },
        { projectID: task.projectID },
        { employeeID: task.employeeID },
      ],
    });

    if (existingTaskForDate) {
      return next(
        createError(
          400,
          `Task for the same project already exists on ${new Date(
            task.date
          ).toLocaleDateString("en-IN")}`
        )
      );
    }

    await TaskModel.create(task);

    return res.status(200).json("Project Task Added Successfully!");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
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
    console.log(error);
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchTaskByDates = async (req, res, next) => {
  try {
    const { employeeID, startDate, endDate } = req.body;

    const taskDetails = await TaskModel.find({
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

    if (!taskDetails) {
      return next(createError(404, `Tasks not found for ${employeeID}`));
    }

    const taskDetailsModified = await Promise.all(
      taskDetails.map(async (projectTask) => {
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
            code: projectTask.projectID,
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

    const sortedTaskData = taskDetailsModified?.sort(function (a, b) {
      return Date.parse(a.date) - Date.parse(b.date);
    });

    return res.status(200).json(sortedTaskData);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchProjectHoursByDate = async (req, res, next) => {
  try {
    const { employeeID, date } = req.body;

    const taskDetails = await TaskModel.find({
      $and: [
        {
          date: date,
        },
        {
          employeeID: employeeID,
        },
      ],
    });

    if (!taskDetails || taskDetails.length === 0) {
      return res.status(404).json({
        message: `Tasks not found`,
      });
    }

    const totalHours = taskDetails.reduce(
      (acc, curr) => {
        return {
          totalHoursInvested: addTimes(
            curr.hoursInvested,
            acc.totalHoursInvested
          ),
        };
      },
      { totalHoursInvested: "00:00" }
    );

    return res.status(200).json(totalHours);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchTaskByProject = async (req, res, next) => {
  try {
    const { projectCode, startDate, endDate } = req.body;

    const taskDetails = await TaskModel.find({
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

    if (!taskDetails || taskDetails.length === 0) {
      return res.status(404).json(`Tasks not found ${projectCode}`);
    }

    const taskDetailsModified = await Promise.all(
      taskDetails.map(async (projectTask) => {
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
          return projectTask;
        }
      })
    );

    return res.status(200).json(taskDetailsModified);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};
