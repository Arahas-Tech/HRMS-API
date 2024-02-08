const RolesModel = require("../models/rolesModel");
const createError = require("../utils/errorHandler");

module.exports.addRole = async (req, res, next) => {
  try {
    let data = req.body;
    const newRole = new RolesModel(data);

    const existingRole = await RolesModel.findOne({
      $or: [
        { roleID: data.roleID },
        { roleName: data.roleName },
        { roleDescription: data.roleDescription },
      ],
    });

    if (existingRole) {
      return next(createError(400, "Role already exists!"));
    }

    const savedRoleDetails = await newRole.save();
    res.status(200).json({
      message: "Role Added Successfully!",
      data: savedRoleDetails,
    });
  } catch (error) {
    next(createError(error));
  }
};

module.exports.getAllRoles = async (_req, res, next) => {
  try {
    const getAllRoles = await RolesModel.find();
    return res.status(200).json(getAllRoles);
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.editRole = async (req, res, next) => {
  try {
    let { roleID, editedRoleDescription } = req.body;

    await RolesModel.findOneAndUpdate(
      { roleID: roleID },
      {
        $set: {
          roleDescription: editedRoleDescription.trim(),
        },
      }
    );

    return res.status(200).json("Successfully updated details");
  } catch (error) {
    return next(createError(500, `Something went wrong! ${error}`));
  }
};

module.exports.deleteRole = async (req, res, next) => {
  try {
    let roleID = req.params.id;
    const deletedRole = await RolesModel.findByIdAndDelete(roleID);

    return res.status(200).json({
      message: "Role SuccessFully Deleted!",
      data: deletedRole,
    });
  } catch (error) {
    return next(createError(error));
  }
};
