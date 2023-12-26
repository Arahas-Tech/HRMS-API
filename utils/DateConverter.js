const DateConverter = (inputDate) => {
  const date = inputDate;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Pad single digit day or month with a leading zero if necessary
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Return date in dd/mm/yyyy format
  return `${formattedDay}/${formattedMonth}/${year}`;
};

module.exports = DateConverter;
