const express = require("express");
const notificationRouter = express.Router();
const {
  getAllNotifications,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  sendNotification,
  sendRejectedNotification,
} = require("../controllers/notifications.controller");
const { verifyAdmin, verifyToken } = require("../utils/verifyToken");

notificationRouter
  .route("/")
  .post(getAllNotifications)
  .patch(markOneNotificationAsRead);

notificationRouter.route("/all").patch(markAllNotificationsAsRead);

notificationRouter.post("/sendNotification", verifyAdmin, sendNotification);
notificationRouter.post(
  "/sendRejectedNotification",
  verifyToken,
  sendRejectedNotification
);

module.exports = notificationRouter;
