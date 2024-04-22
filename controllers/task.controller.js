const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const { addTimes } = require("../utils/AddTwoStringHours");
const { modifyTaskDetails } = require("../utils/modifyProjectTask");
const createError = require("../utils/errorHandler");
const { convertToDecimalHours } = require("../utils/convertToDecimalHours");
const { getStartEndDate } = require("../utils/getStartEndDate");
const convertDate = require("../utils/DateConverter");
const { getDatesInRange } = require("../utils/GetDatesInRange");

module.exports.fetchAllTasks = async (req, res, next) => {
  try {
    const { date, employee: employeeID, project: projectCode } = req.query;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return res.status(404).json("No tasks found.");
    }

    const taskDetailsModified = await modifyTaskDetails(taskDetails);

    return res.status(200).json(taskDetailsModified);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

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
          `Task for the same project already exists on ${convertDate(
            task.date
          )})`
        )
      );
    }

    await TaskModel.create(task);

    return res.status(200).json("Task added successfully!");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.editTask = async (req, res, next) => {
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
    const response = await TaskModel.findOneAndUpdate(
      {
        $and: [
          { date: task.date },
          { projectID: task.projectID },
          { employeeID: task.employeeID },
        ],
      },
      {
        $set: {
          summary: task.summary,
          hoursInvested: task.hoursInvested,
        },
      }
    );

    if (!response) {
      return next(createError(400, "Something went wrong"));
    }

    return res.status(200).json("Task edited successfully!");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchTasksByDate = async (req, res, next) => {
  try {
    const { taskDate } = req.body;

    const taskDetails = await TaskModel.find({
      date: taskDate,
      employeeID: req.body.employeeID,
    });

    if (!taskDetails) {
      return res.status(404).json("Tasks not found for selected date");
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
            projectCode: projectTask.projectID,
            projectName: result[0]?.name,
            date: convertDate(projectTask.date),
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

module.exports.fetchTasksByDates = async (req, res, next) => {
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
            date: convertDate(projectTask.date),
            summary: projectTask.summary,
            hoursInvested: projectTask.hoursInvested,
          };
        } catch (error) {
          return next(createError(500, "Something went wrong"));
        }
      })
    );

    return res.status(200).json(taskDetailsModified);
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
      return next(createError(404, "Not found."));
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
            date: convertDate(projectTask.date),
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

module.exports.fetchDayWiseCount = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    taskDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    let dayWiseHours = {};

    taskDetails.forEach((task) => {
      const date = convertDate(task.date);

      if (!dayWiseHours[date]) {
        dayWiseHours[date] = {};
      }

      if (!dayWiseHours[date][task.employeeID]) {
        dayWiseHours[date][task.employeeID] = convertToDecimalHours(
          task.hoursInvested
        );
      }

      dayWiseHours[date][task.employeeID] += convertToDecimalHours(
        task.hoursInvested
      );
    });

    let dayWiseCount = {};

    Object.keys(dayWiseHours).forEach((date) => {
      if (!dayWiseCount[date]) {
        dayWiseCount[date] = {
          lessThan8hr: 0,
          moreThan8hr: 0,
        };
      }

      Object.values(dayWiseHours[date]).forEach((totalHours) => {
        if (totalHours >= 8) {
          dayWiseCount[date].moreThan8hr++;
        } else {
          dayWiseCount[date].lessThan8hr++;
        }
      });
    });

    return res.status(200).json(dayWiseCount);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchDayWiseEmployeesCount = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    taskDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    let dayWiseCount = {};
    taskDetails.forEach(({ date, employeeID }) => {
      const taskDate = convertDate(date);

      if (!dayWiseCount[taskDate]) dayWiseCount[taskDate] = {};

      if (!dayWiseCount[taskDate][employeeID])
        dayWiseCount[taskDate][employeeID] = 1;
      else {
        dayWiseCount[taskDate][employeeID]++;
      }
    });

    Object.entries(dayWiseCount).forEach(([key, value]) => {
      dayWiseCount[key] = Object.keys(value).length;
    });

    return res.status(200).json(dayWiseCount);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchDayWiseProjectsCount = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    taskDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    let dayWiseCount = {};
    taskDetails.forEach(({ date, projectID }) => {
      const taskDate = convertDate(date);

      if (!dayWiseCount[taskDate]) dayWiseCount[taskDate] = {};

      if (!dayWiseCount[taskDate][projectID])
        dayWiseCount[taskDate][projectID] = 1;
      else {
        dayWiseCount[taskDate][projectID]++;
      }
    });

    Object.entries(dayWiseCount).forEach(([key, value]) => {
      dayWiseCount[key] = Object.keys(value).length;
    });

    return res.status(200).json(dayWiseCount);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchDayWiseProjectsAvg = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    taskDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    const dayEmployeeWiseHours = {};

    taskDetails.forEach(({ date, employeeID, hoursInvested }) => {
      const taskDate = convertDate(date);

      if (!dayEmployeeWiseHours[taskDate]) {
        dayEmployeeWiseHours[taskDate] = {};
      }

      if (!dayEmployeeWiseHours[taskDate][employeeID]) {
        dayEmployeeWiseHours[taskDate][employeeID] = 0;
      }

      dayEmployeeWiseHours[taskDate][employeeID] +=
        convertToDecimalHours(hoursInvested);
    });

    const dayWiseAvgHours = {};
    Object.entries(dayEmployeeWiseHours).forEach(([date, employees]) => {
      const totalTasks = Object.keys(employees).length;
      let totalHours = 0;

      Object.values(employees).forEach((total) => {
        totalHours += total;
      });

      const averageHours = totalTasks > 0 ? totalHours / totalTasks : 0;
      dayWiseAvgHours[date] = averageHours.toPrecision(2);
    });

    return res.status(200).json(dayWiseAvgHours);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchDayWiseHours = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    taskDetails.sort((a, b) => a.date.getTime() - b.date.getTime());

    let dayWiseData = {};
    taskDetails.forEach((task) => {
      const date = convertDate(task.date);
      const hours = task.hoursInvested;

      if (dayWiseData[date]) {
        dayWiseData[date] = addTimes(dayWiseData[date], hours);
      } else {
        dayWiseData[date] = hours;
      }
    });

    return res.status(200).json(dayWiseData);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchProjectWiseHours = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    taskDetails.sort((a, b) => a.hoursInvested.localeCompare(b.hoursInvested));

    const taskProjectIDs = taskDetails.map(
      (projectTask) => projectTask.projectID
    );
    const uniqueProjectIDs = Array.from(new Set(taskProjectIDs));

    const projectDetailsMap = new Map();
    const projectDetails = await ProjectModel.aggregate([
      { $match: { code: { $in: uniqueProjectIDs } } },
      { $project: { code: 1, projectName: "$name" } },
    ]);

    projectDetails?.forEach((project) => {
      projectDetailsMap.set(project.code, project.projectName);
    });

    let dayWiseData = {};

    taskDetails.forEach(({ projectID, hoursInvested }) => {
      const projectName = projectDetailsMap.get(projectID);

      if (projectName) {
        if (dayWiseData[projectName]) {
          dayWiseData[projectName] = addTimes(
            dayWiseData[projectName],
            hoursInvested
          );
        } else {
          dayWiseData[projectName] = hoursInvested;
        }
      }
    });

    return res.status(200).json(dayWiseData);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchEmployeeWiseHours = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    const taskEmployeeIDs = taskDetails.map(
      (projectTask) => projectTask.employeeID
    );
    const uniqueEmployeeIDs = Array.from(new Set(taskEmployeeIDs));

    const employeeDetailsMap = new Map();
    const employeeDetails = await EmployeeModel.aggregate([
      { $match: { _id: { $in: uniqueEmployeeIDs } } },
      {
        $project: {
          employeeName: { $concat: ["$employeeID", "-", "$employeeName"] },
        },
      },
    ]);

    employeeDetails?.forEach((employee) => {
      employeeDetailsMap.set(employee._id.toString(), employee.employeeName);
    });

    let dayWiseData = {};

    taskDetails.forEach(({ employeeID, hoursInvested }) => {
      const employeeName = employeeDetailsMap.get(employeeID.toString());

      if (employeeName) {
        if (dayWiseData[employeeName]) {
          dayWiseData[employeeName] = addTimes(
            dayWiseData[employeeName],
            hoursInvested
          );
        } else {
          dayWiseData[employeeName] = hoursInvested;
        }
      }
    });

    return res.status(200).json(dayWiseData);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchProjectWiseContribution = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    const taskEmployeeIDs = taskDetails.map(
      (projectTask) => projectTask.employeeID
    );
    const taskProjectIDs = taskDetails.map(
      (projectTask) => projectTask.projectID
    );
    const uniqueEmployeeIDs = Array.from(new Set(taskEmployeeIDs));
    const uniqueProjectIDs = Array.from(new Set(taskProjectIDs));

    const employeeDetailsMap = new Map();
    const employeeDetails = await EmployeeModel.aggregate([
      { $match: { _id: { $in: uniqueEmployeeIDs } } },
      {
        $project: {
          employeeName: { $concat: ["$employeeID", "-", "$employeeName"] },
        },
      },
    ]);

    employeeDetails?.forEach((employee) => {
      employeeDetailsMap.set(employee._id.toString(), employee.employeeName);
    });

    const projectDetailsMap = new Map();
    const projectDetails = await ProjectModel.aggregate([
      { $match: { code: { $in: uniqueProjectIDs } } },
      { $project: { code: 1, projectName: "$name" } },
    ]);

    projectDetails?.forEach((project) => {
      projectDetailsMap.set(project.code, project.projectName);
    });

    let data = [];

    const projectNames = [];
    const employeeNames = [];

    taskDetails.forEach(({ projectID, employeeID }) => {
      const projectName = projectDetailsMap.get(projectID);
      const employeeName = employeeDetailsMap.get(employeeID.toString());

      if (!projectNames.includes(projectName) && projectName !== undefined) {
        projectNames.push(projectName);
      }

      if (!employeeNames.includes(employeeName)) {
        employeeNames.push(employeeName);
      }
    });

    data = employeeNames.map((name) => {
      return {
        name: name,
        data: Array(projectNames.length).fill(0),
      };
    });

    taskDetails.forEach(({ projectID, employeeID, hoursInvested }) => {
      const projectName = projectDetailsMap.get(projectID);
      const employeeName = employeeDetailsMap.get(employeeID.toString());

      const employeeIndex = employeeNames.indexOf(employeeName);
      const projectIndex = projectNames.indexOf(projectName);

      data[employeeIndex].data[projectIndex] +=
        convertToDecimalHours(hoursInvested);
    });

    const categories = projectNames.map((projectName) => projectName);

    const chartData = {
      categories: categories,
      series: data,
    };

    return res.send(chartData);
  } catch (error) {
    console.log(error);
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchUniqueEmployeesCount = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    const taskEmployeeIDs = taskDetails.map((projectTask) =>
      projectTask.employeeID.toString()
    );
    const uniqueEmployeeIDs = Array.from(new Set(taskEmployeeIDs));

    return res.status(200).json(uniqueEmployeeIDs.length);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.fetchUniqueProjectsCount = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    const taskProjectIDs = taskDetails.map((projectTask) =>
      projectTask.projectID.toString()
    );
    const uniqueProjectIDs = Array.from(new Set(taskProjectIDs));

    return res.status(200).json(uniqueProjectIDs.length);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.fetchCurrentMonthTasks = async (req, res, next) => {
  try {
    const employeeID = req.params.employeeID;

    const { startDate, endDate } = getStartEndDate(new Date());

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
      return next(createError(404, `Tasks not found`));
    }

    const datesInRange = getDatesInRange(startDate, endDate);

    const taskList = [];

    datesInRange?.forEach((date) => {
      const matchingProjectTask = taskDetails.filter(
        (task) => convertDate(date) === convertDate(task.date)
      );

      if (matchingProjectTask?.length !== 0) {
        taskList.push(
          ...matchingProjectTask.map((data) => ({
            date: data.date,
            hoursInvested: data.hoursInvested,
          }))
        );
      } else {
        taskList.push({
          date: date,
          hoursInvested: "00:00",
        });
      }
    });

    let dayWiseHours = {};

    taskList.forEach(({ date, hoursInvested }) => {
      const taskDate = convertDate(date);

      if (!dayWiseHours[taskDate] && hoursInvested === "00:00") {
        dayWiseHours[taskDate] = hoursInvested;
      } else {
        dayWiseHours[taskDate] = addTimes(
          dayWiseHours[taskDate],
          hoursInvested
        );
      }
    });

    return res.status(200).json(dayWiseHours);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.fetchInactiveEmployees = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const taskDetails = await TaskModel.find(filter);

    if (!taskDetails || taskDetails.length === 0) {
      return next(createError(404, "Not found."));
    }

    const taskEmployeeIDs = taskDetails.map((projectTask) =>
      projectTask.employeeID.toString()
    );
    const uniqueEmployeeIDs = Array.from(new Set(taskEmployeeIDs));

    const apiFields = ["employeeID", "employeeName", "employeeEmail"];

    const allEmployees = await EmployeeModel.find({
      _id: { $nin: uniqueEmployeeIDs },
      isActive: true,
      roleID: { $nin: ["ATPL-ADMIN", "ATPL-PM"] },
      employeeID: { $ne: "Test001" },
    }).select(apiFields.join(" "));

    return res.status(200).json(allEmployees);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.fetchEmployeesTasksStats = async (req, res, next) => {
  try {
    const date = req.query.date;
    const employeeID = req.query.employee;
    const projectCode = req.query.project;

    const { startDate, endDate } = getStartEndDate(date);

    let filter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (employeeID || projectCode) {
      filter.$or = [{ employeeID: employeeID }, { projectID: projectCode }];
    }

    const filledDaysByEmployee = await TaskModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$employeeID",
          filledDays: {
            $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employeeInfo",
        },
      },
      {
        $unwind: "$employeeInfo",
      },
      {
        $project: {
          _id: 0,
          employeeID: "$employeeInfo.employeeID",
          employeeName: "$employeeInfo.employeeName",
          employeeEmail: "$employeeInfo.employeeEmail",
          daysCount: { $size: "$filledDays" },
        },
      },
    ]).sort({ daysCount: 1 });

    return res.status(200).json(filledDaysByEmployee);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};
