const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const { search, categories } = req.query;

    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (categories) {
      const categoryIds = categories.split(',').filter(Boolean);
      if (categoryIds.length) {
        filter.categories = { $in: categoryIds };
      }
    }

    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return ApiResponse.success(res, {
      message: 'Products fetched successfully',
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, quantity, categories } = req.body;

    const existing = await Product.findOne({
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
    });

    if (existing) {
      return ApiResponse.error(res, {
        statusCode: 409,
        message: 'A product with this name already exists',
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      quantity,
      categories,
    });

    await product.populate('categories', 'name');

    return ApiResponse.success(res, {
      statusCode: 201,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return ApiResponse.error(res, {
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return ApiResponse.success(res, {
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, createProduct, deleteProduct };
