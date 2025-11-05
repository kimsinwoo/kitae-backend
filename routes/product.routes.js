const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/:productId/variant', productController.getVariantBySizeAndColor); // variant 찾기 (size, color로)
router.get('/:id', productController.getProductById);
router.get('/:id/reviews', productController.getProductReviews);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

