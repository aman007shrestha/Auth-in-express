const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(`error object: ${err}`);
  console.log(`error name ${err.name}`);
  console.log(`error code ${err.code}`);
  console.log(`error message ${err.message}`);
  if (err.code === 11000) {
    const message = `Duplicate Field Value Entered`;
    error = new ErrorResponse(message, 400);
  }
  if (err.name === 'ValiationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  console.log(`error status code ${error.statusCode}`);
  console.log(`error message ${error.message}`);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
