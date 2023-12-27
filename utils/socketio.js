const AdminNotificationModel = require("../models/adminNotificationsModel");
const EmployeeModel = require("../models/employeeModel");
let usersio = [];

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("setUserId", async (userId) => {
      if (userId) {
        const oneUser = await EmployeeModel.findById(userId).lean().exec();
        if (oneUser) {
          usersio[userId] = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });
    socket.on("getNotificationsLength", async (userId) => {
      const notifications = await AdminNotificationModel.find({
        user: userId,
        read: false,
      }).lean();
      usersio[userId]?.emit("notificationsLength", notifications.length || 0);
    });

    socket.on("disconnect", (userId) => {
      console.log(`🔥 user with id ${userId} disconnected from socket`);
      usersio[userId] = null;
    });
  });
};
