const ModulesModel = require("../models/moduleModel");
const createError = require("../utils/errorHandler");

module.exports.createModule = async (req, res, next) => {
  try {
    let data = req.body;
    const newModule = new ModulesModel(data);

    const existingModule = await ModulesModel.findOne({
      moduleID: data.moduleID,
    });

    if (existingModule) {
      return next(createError(400, "Module already exists!"));
    }

    const savedModuleDetails = await newModule.save();
    res.status(200).json({
      message: "Module added successfully!",
      data: savedModuleDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.fetchModules = async (_req, res, next) => {
  try {
    const allModules = await ModulesModel.find();
    return res.status(200).json(allModules);
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.activateModule = async (req, res, next) => {
  try {
    let { moduleID, editedModuleName } = req.body;

    const existingModule = await ModulesModel.find({
      moduleName: editedModuleName.trim(),
      _id: { $ne: moduleID }, // Exclude the current record being edited
    });

    // ? Check if existingModule array has any elements
    if (existingModule && existingModule.length > 0) {
      return next(createError(500, "Module already exists"));
    }

    await ModulesModel.findOneAndUpdate(
      { _id: moduleID },
      {
        $set: {
          moduleName: editedModuleName,
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deactivateModule = async (req, res, next) => {
  try {
    let { moduleID, editedModuleName } = req.body;

    const existingModule = await ModulesModel.find({
      moduleName: editedModuleName.trim(),
      _id: { $ne: moduleID }, // Exclude the current record being edited
    });

    // ? Check if existingModule array has any elements
    if (existingModule && existingModule.length > 0) {
      return next(createError(500, "Module already exists"));
    }

    await ModulesModel.findOneAndUpdate(
      { _id: moduleID },
      {
        $set: {
          moduleName: editedModuleName,
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong!`));
  }
};

module.exports.deleteModule = async (req, res, next) => {
  try {
    let moduleID = req.params.id;
    const deletedModule = await ModulesModel.findByIdAndDelete(moduleID);

    return res.status(200).json({
      message: "Module successFully deleted!",
      data: deletedModule,
    });
  } catch (error) {
    return next(createError(error));
  }
};
