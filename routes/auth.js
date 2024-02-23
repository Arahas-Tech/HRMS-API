const express = require("express");
const {
  login,
  logout,
  getUserDetailsByID,
  forgotPassword,
  changePassword,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../utils/verifyToken");
const authRouter = express.Router();

//Employee Auth
authRouter.post("/login-user", login);
authRouter.get("/logout", verifyToken, logout);

//User Details
authRouter.post("/getUserDetails", verifyToken, getUserDetailsByID);

// Password Forgot and Change
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/changePassword", verifyToken, changePassword);

module.exports = authRouter;
