const express = require("express");
const designationRouter = express.Router();

const { verifyAdmin } = require("../utils/verifyToken");
const {
  addDesignation,
  getAllDesignations,
  editDesignation,
  deleteDesignation,
} = require("../controllers/designationController");

designationRouter.get("/getAllDesignations", verifyAdmin, getAllDesignations);
designationRouter.post("/addDesignation", addDesignation);
designationRouter.patch("/editDesignation", verifyAdmin, editDesignation);
designationRouter.delete(
  "/deleteDesignation/:id",
  verifyAdmin,
  deleteDesignation
);

module.exports = designationRouter;
