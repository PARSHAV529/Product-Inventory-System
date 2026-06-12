const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return ApiResponse.error(res, {
      statusCode: 409,
      message: `A product with this ${field} already exists`,
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  return ApiResponse.error(res, {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong',
  });
};

module.exports = errorHandler;
