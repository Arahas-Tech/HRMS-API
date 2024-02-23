const express = require("express");
const swagger = require("./swagger");
const path = require("path");
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
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000", "https://arth.arahas.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
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
app.get("/", async (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Routes
const authRoutes = require("./routes/auth");
const employeesRoutes = require("./routes/employee");
const trainingRoutes = require("./routes/training");
const roleRoutes = require("./routes/roles");
const departmentsRoutes = require("./routes/departments");
const designationsRoutes = require("./routes/designations");
const statesRoutes = require("./routes/states");
const citiesRoutes = require("./routes/cities");
const accessRoutes = require("./routes/access");
const modulesRoutes = require("./routes/modules");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const notificationRoutes = require("./routes/adminNotification");

// Route Middleware
app.use("/auth", authRoutes);
app.use("/employees", employeesRoutes);
app.use("/trainings", trainingRoutes);
app.use("/roles", roleRoutes);
app.use("/departments", departmentsRoutes);
app.use("/designations", designationsRoutes);
app.use("/states", statesRoutes);
app.use("/cities", citiesRoutes);
app.use("/access", accessRoutes);
app.use("/modules", modulesRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/notifications", notificationRoutes);

swagger(app);

// Error handling middleware
app.use((err, _req, res, _next) => {
  res
    .status(err.errorStatus || 500)
    .send(err.errorMessage || "Something went wrong at server's end!");
});

// ? Connect to MongoDB
connectToDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
