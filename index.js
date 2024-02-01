const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Middleware for handling CORS
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// CORS headers setup
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const employeesRoutes = require("./routes/employee");
const trainingRoutes = require("./routes/training");
const roleRoutes = require("./routes/roles");
const departmentsRouter = require("./routes/departments");
const notificationRoutes = require("./routes/adminNotification");
const projectRoutes = require("./routes/projects");
const projectTaskRoutes = require("./routes/projectTask");

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/departments", departmentsRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projectTasks", projectTaskRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  res
    .status(err.errorStatus || 500)
    .send(err.errorMessage || "Something went wrong at server's end!");
});

// Connect to MongoDB
connectToDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
