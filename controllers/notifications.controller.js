const AdminNotificationModel = require("../models/adminNotificationsModel");
const createError = require("../utils/errorHandler");

// @desc Get all notifications
// @Route GET /
// @Private access
const getAllNotifications = async (req, res) => {
  try {
    const { userID } = req.body;
    const filteredNotifications = await AdminNotificationModel.find({
      $and: [
        {
          user: userID,
        },
        {
          read: false,
        },
      ],
    });

    if (!filteredNotifications) {
      return next(createError(400, "No Notifications Found!"));
    }

    return res.status(200).json(filteredNotifications);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

// @desc Mark One Notification As Read
// @Route Patch /notifications/
// @Access Private
const markOneNotificationAsRead = async (req, res) => {
  const { userID, notificationID } = req.body;

  const updateNotification = await AdminNotificationModel.findOneAndUpdate(
    {
      $and: [
        { user: userID },
        {
          _id: notificationID,
        },
      ],
    },
    {
      $set: {
        read: true,
      },
    }
  );

  if (!updateNotification) {
    return res.status(400).json({ message: "No notifications found" });
  }

  res.status(200).json(updateNotification);
};

// @desc Mark All Notifications As Read
// @Route Patch /notifications/All
// @Access Private
const markAllNotificationsAsRead = async (req, res) => {
  const { userID } = req.body;

  const notificationsUpdateMany = await AdminNotificationModel.updateMany(
    { user: userID },
    { $set: { read: true } }
  );
  if (!notificationsUpdateMany) {
    return res
      .status(400)
      .json({ message: "Error Marking all notifications as read" });
  }
  return res
    .status(200)
    .json({ success: true, message: `All notifications marked as read` });
};

const sendNotification = async (req, res) => {
  const { userID } = req.body;

  await AdminNotificationModel.create({
    user: userID,
    title: "Reminder",
    text: "You have pending trainings, complete your trainings!",
    read: false,
  });

  return res.status(200).send("Notification sent to employee!");
};

module.exports = {
  getAllNotifications,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  sendNotification,
};
