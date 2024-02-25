module.exports.getDatesInRange = (startDate, endDate) => {
  const rangeOfDates = [];
  const date = new Date(startDate.getTime());

  while (date <= endDate) {
    rangeOfDates.push(new Date(date).toISOString());
    date.setDate(date.getDate() + 1);
  }

  return rangeOfDates;
};
