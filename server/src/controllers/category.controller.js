const Category = require('../models/Category');
const ApiResponse = require('../utils/ApiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    return ApiResponse.success(res, {
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };
