const convertDate = (inputDate) => {
  return new Date(inputDate).toLocaleDateString("en-IN");
};

module.exports = convertDate;
