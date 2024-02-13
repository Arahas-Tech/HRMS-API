const express = require("express");
const {
  login,
  logout,
  getUserDetailsFromToken,
  forgotPassword,
  changePassword,
} = require("../controllers/authController");
const { verifyToken } = require("../utils/verifyToken");
const authRouter = express.Router();

//Employee Auth
authRouter.post("/login-user", login);
authRouter.get("/logout", verifyToken, logout);

//User Details
authRouter.post("/getUserDetails", verifyToken, getUserDetailsFromToken);

// Password Forgot and Change
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/changePassword", verifyToken, changePassword);

module.exports = authRouter;
