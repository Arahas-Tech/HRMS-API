module.exports.getStartEndDate = (date) => {
  // Set the start date to the first day of the given date
  const startDate = new Date(
    new Date(date)?.getFullYear(),
    new Date(date)?.getMonth(),
    1
  );

  // Set the end date to the last day of the given date
  const endDate = new Date(
    new Date(date)?.getFullYear(),
    new Date(date)?.getMonth() + 1,
    0
  );

  return { startDate, endDate };
};
