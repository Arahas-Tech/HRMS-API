const EmployeeModel = require("../models/employeeModel");
const ProjectModel = require("../models/projectModel");
const convertDate = require("./DateConverter");

module.exports.modifyTaskDetails = async (taskDetails) => {
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

  const taskDetailsModified = taskDetails.map((projectTask) => {
    const employeeID = projectTask.employeeID.toString();
    const employeeName = employeeDetailsMap.has(employeeID)
      ? employeeDetailsMap.get(employeeID)
      : "Unknown Employee";

    const projectID = projectTask.projectID;
    const projectName = projectDetailsMap.has(projectID)
      ? projectDetailsMap.get(projectID)
      : "Unknown Project";

    return {
      employeeName: employeeName,
      projectName: projectName,
      hoursInvested: projectTask.hoursInvested,
      date: convertDate(projectTask.date),
      summary: projectTask.summary,
    };
  });

  return taskDetailsModified;
};
