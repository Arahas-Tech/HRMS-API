module.exports.convertToDecimalHours = (timeString) => {
  const [hours, minutes] = timeString?.split(":")?.map(Number);
  const totalMinutes = hours * 60 + minutes;
  const decimalHours = (totalMinutes / 60).toFixed(1);

  return parseFloat(decimalHours);
};
