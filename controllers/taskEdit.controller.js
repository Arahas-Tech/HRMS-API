const TaskEdit = require("../models/taskEdit.model");
const TaskModel = require("../models/taskModel");
const ProjectModel = require("../models/projectModel");

const createError = require("../utils/errorHandler");
const convertDate = require("../utils/DateConverter");

module.exports.fetchManagerPendingApprovals = async (req, res, next) => {
  try {
    const employee = req.params.id;

    const requestedEditDetails = await TaskEdit.find({
      sentTo: employee,
    });

    if (!requestedEditDetails || requestedEditDetails.length === 0) {
      return res.status(404).json("No tasks found.");
    }

    // requestedEditDetails.forEach((data) => ({
    //   rejectedOn: data.rejectedOn,
    //   rejectedBy: data.rejectedBy,
    //   sentBy: data.sentBy,
    //   sentTo: data.sentTo,
    //   approvedOn: data.approvedOn,
    //   approvedBy: data.approvedBy,
    //   employeeID: data.employeeID,
    //   employeeName: data.employeeName,
    //   projectID: data.projectID,
    //   projectName: data.projectName,
    //   oldSummary: data.oldSummary,
    //   newSummary: data.newSummary,
    //   oldHoursInvested: data.oldHoursInvested,
    //   updatedHoursInvested: data.updatedHoursInvested,
    //   date: convertDate(data.date),
    //   sentOn: convertDate(data.sentOn),
    // }));

    return res.status(200).json(requestedEditDetails);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.sendEditApproval = async (req, res, next) => {
  try {
    const data = req.body;

    const requestedEdit = await TaskModel.find({
      $and: [
        {
          date: data.date,
        },
        {
          projectID: data.projectID,
        },
        {
          employeeID: data.employeeID,
        },
      ],
    });

    if (!requestedEdit || requestedEdit.length === 0) {
      return res.status(404).json("No tasks found to edit");
    }

    const projectDetails = await ProjectModel.findOne({ code: data.projectID });

    const createdData = await TaskEdit.create({
      ...data,
      sentTo: projectDetails.projectManager,
      projectName: projectDetails.name,
    });

    return res.status(200).json(createdData);
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.approveEditTask = async (req, res, next) => {
  try {
    const data = req.body;

    const requestedEdit = await TaskEdit.find({
      $and: [
        { date: data.date },
        { projectID: data.projectID },
        { sentBy: data.sentBy },
        { sentTo: data.sentTo },
      ],
    });

    if (!requestedEdit || requestedEdit.length === 0) {
      return res.status(404).json("No tasks found to approve");
    }

    requestedEdit[0].approvedBy = data.sentTo;
    requestedEdit[0].approvedOn = new Date().setHours(0, 0, 0, 0);

    await requestedEdit[0].save();

    return res.status(200).json("Approved");
  } catch (error) {
    console.log(error);
    return next(createError(500, "Something went wrong"));
  }
};

module.exports.rejectEditTask = async (req, res, next) => {
  try {
    const data = req.body;

    const requestedEdit = await TaskEdit.find({
      $and: [
        {
          date: data.date,
        },
        {
          projectID: data.projectID,
        },
        {
          sentBy: data.sentBy,
        },
        {
          sentTo: data.sentTo,
        },
      ],
    });

    if (!requestedEdit || requestedEdit.length === 0) {
      return res.status(404).json("No tasks found to reject");
    }

    requestedEdit[0].rejectedBy = data.sentTo;
    requestedEdit[0].rejectedOn = new Date().setHours(0, 0, 0, 0);

    await requestedEdit[0].save();

    return res.status(200).json("Rejected");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};
