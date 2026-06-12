const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = validate;
