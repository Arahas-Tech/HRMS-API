const express = require("express");
const notificationRouter = express.Router();
const {
  getAllNotifications,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  sendNotification,
} = require("../controllers/notifications.controller");
const { verifyAdmin } = require("../utils/verifyToken");

notificationRouter
  .route("/")
  .post(getAllNotifications)
  .patch(markOneNotificationAsRead);

notificationRouter.route("/all").patch(markAllNotificationsAsRead);

notificationRouter.post("/sendNotification", verifyAdmin, sendNotification);

module.exports = notificationRouter;
