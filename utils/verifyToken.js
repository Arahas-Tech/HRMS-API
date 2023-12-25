const jwt = require("jsonwebtoken");
const createError = require("./errorHandler");

// Function to verify token
const verifyToken = (req, _res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extracting the token from Authorization header

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, employee) => {
    if (err) return next(createError(403, "Not Valid Token!"));
    req.RoleID = employee.roleID;
    next();
  });
};

// Function to verify admin access
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.body.createdBy === "ATPL-ADMIN" ||
      req.body.createdBy === "ATPL-HR" ||
      req.body.createdBy === "ATR-Employee" ||
      req.RoleID === "ATPL-ADMIN" ||
      req.RoleID === "ATPL-HR" ||
      req.RoleID === "ATR-Employee"
    ) {
      next();
    } else {
      return next(createError(403, "You are not authorized as an admin!"));
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
