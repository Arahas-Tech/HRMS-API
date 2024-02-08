const EmployeeModel = require("../models/employeeModel");

async function getLookupMap(collectionName, queryField, returnField) {
  try {
    const lookupData = await EmployeeModel.find({ isActive: true }).distinct(
      queryField
    );
    const lookupResults = await collectionName.find(
      { [queryField]: { $in: lookupData } },
      { [queryField]: 1, [returnField]: 1 }
    );

    const resultMap = new Map();
    lookupResults.forEach((result) =>
      resultMap.set(result[queryField], result[returnField])
    );
    return resultMap;
  } catch (error) {
    console.error(`Error fetching lookup data from ${collectionName}:`, error);
    throw error; // Propagate the error
  }
}

module.exports = getLookupMap;

module.exports = getLookupMap;
