const AdminNotificationModel = require("../models/adminNotificationsModel");
const createError = require("../utils/errorHandler");

// @desc Get all notifications
// @Route GET /
// @Private access
const getAllNotifications = async (req, res) => {
  try {
    const { id } = req.body;
    const filteredNotifications = await AdminNotificationModel.find({
      user: id,
    });

    if (!filteredNotifications) {
      return next(createError(400, "No Notifications Found!"));
    }

    return res.status(200).json(filteredNotifications);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

// @desc delete a notification
// @Route DELETE /notifications
// @Private access
const deleteNotification = async (req, res) => {
  const { id } = req.body;

  const deleteNotification = await AdminNotificationModel.findById(id).exec();
  if (!deleteNotification) {
    return res
      .status(400)
      .json({ message: `Can't find a notification with id: ${id}` });
  }
  const result = await deleteNotification.deleteOne();
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the notification with id: ${id}` });
  }
  return res
    .status(200)
    .json({ message: `Notification with id: ${id} deleted with success` });
};

// @desc delete All notification
// @Route DELETE /notifications/all
// @Private access
const deleteAllNotifications = async (req, res) => {
  const { id } = req.body;

  const notificationsDeleteMany = await AdminNotificationModel.deleteMany({
    user: id,
  });
  if (!notificationsDeleteMany) {
    return res
      .status(400)
      .json({ message: "Error Deleting all notifications as read" });
  }
  return res
    .status(200)
    .json({ message: `All notifications for user ${id}marked was deleted` });
};

// @desc Mark One Notification As Read
// @Route Patch /notifications/
// @Access Private
const markOneNotificationAsRead = async (req, res) => {
  const { id } = req.body;

  const updateNotification = await AdminNotificationModel.find({ id }).exec();
  if (!updateNotification) {
    return res.status(400).json({ message: "No notifications found" });
  }
  AdminNotificationModel.read = false;
  await AdminNotificationModel.save();
  res.status(200).json(updateNotification);
};

// @desc Mark All Notifications As Read
// @Route Patch /notifications/All
// @Access Private
const markAllNotificationsAsRead = async (req, res) => {
  const { id } = req.body;

  const notificationsUpdateMany = await AdminNotificationModel.updateMany(
    { user: id },
    { $set: { read: true } }
  );
  if (!notificationsUpdateMany) {
    return res
      .status(400)
      .json({ message: "Error Marking all notifications as read" });
  }
  return res
    .status(200)
    .json({ message: `All notifications for user ${id}marked as read` });
};

const sendNotification = async (req, res) => {
  const { id } = req.body;
  console.log(id);

  const resp = await AdminNotificationModel.create({
    user: id,
    title: "Reminder",
    type: 1,
    text: "You have pending trainings, complete your trainings!",
    read: false,
  });

  return res.status(200).send("Notification sent to employee!");
};
module.exports = {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  sendNotification,
};
