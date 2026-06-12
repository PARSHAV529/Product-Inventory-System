const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/product.controller');
const { createProductRules } = require('../validators/product.validator');
const validate = require('../middlewares/validate');

router.get('/', getProducts);
router.post('/', createProductRules, validate, createProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
