const express = require("express");
const {
  register,
  login,
  logout,
  getAllRoles,
  createRole,
  getUserDetailsFromToken,
} = require("../controllers/authController");
const authRoute = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");

//Employee Auth
authRoute.post("/register", verifyAdmin, register);
authRoute.post("/login", login);
authRoute.get("/logout", logout);

//Role Auth
authRoute.post("/createRole", verifyAdmin, createRole);
authRoute.get("/allRoles", verifyAdmin, getAllRoles);

//User Details
authRoute.post("/getUserDetails", getUserDetailsFromToken);

module.exports = authRoute;
