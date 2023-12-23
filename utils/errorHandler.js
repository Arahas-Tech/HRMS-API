const createError = (status, message) => {
  const err = new Error();
  err.errorStatus = status;
  err.errorMessage = message;
  return err;
};

module.exports = createError;
