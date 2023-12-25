const express = require("express");
const {
  login,
  logout,
  getUserDetailsFromToken,
} = require("../controllers/authController");
const authRoute = express.Router();

//Employee Auth
authRoute.post("/login", login);
authRoute.get("/logout", logout);

//User Details
authRoute.post("/getUserDetails", getUserDetailsFromToken);

module.exports = authRoute;
