const express = require("express");
const notificationRouter = express.Router();
const {
  getAllNotifications,
  deleteNotification,
  markOneNotificationAsRead,
  deleteAllNotifications,
  markAllNotificationsAsRead,
  sendNotification,
} = require("../controllers/notificationsController");
const { verifyAdmin } = require("../utils/verifyToken");

notificationRouter
  .route("/")
  .post(getAllNotifications)
  .delete(deleteNotification)
  .patch(markOneNotificationAsRead);

notificationRouter
  .route("/all")
  .delete(deleteAllNotifications)
  .patch(markAllNotificationsAsRead);

notificationRouter.post("/sendNotification", verifyAdmin, sendNotification);

module.exports = notificationRouter;
