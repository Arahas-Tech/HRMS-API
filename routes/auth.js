const express = require("express");
const {
  login,
  logout,
  getUserDetailsFromToken,
} = require("../controllers/authController");
const { verifyToken } = require("../utils/verifyToken");
const authRouter = express.Router();

//Employee Auth
authRouter.post("/login-user", login);
authRouter.get("/logout", verifyToken, logout);

//User Details
authRouter.post("/getUserDetails", verifyToken, getUserDetailsFromToken);

module.exports = authRouter;
