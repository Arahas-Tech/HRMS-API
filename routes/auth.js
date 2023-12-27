const express = require("express");
const {
  login,
  logout,
  getUserDetailsFromToken,
} = require("../controllers/authController");
const authRouter = express.Router();

//Employee Auth
authRouter.post("/login", login);
authRouter.get("/logout", logout);

//User Details
authRouter.post("/getUserDetails", getUserDetailsFromToken);

module.exports = authRouter;
