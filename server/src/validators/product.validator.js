const { body } = require('express-validator');

const createProductRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category is required'),

  body('categories.*')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

module.exports = { createProductRules };
