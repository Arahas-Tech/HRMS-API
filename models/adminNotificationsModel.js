const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "employee", require: true },
    title: { type: String, require: true },
    text: { type: String, require: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const AdminNotificationModel = mongoose.model(
  "notification",
  adminNotificationSchema
);

module.exports = AdminNotificationModel;
