const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware, mdMiddleware, csMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Dashboard
router.get('/dashboard', adminMiddleware, adminController.getDashboard);

// User Management
router.get('/users', adminMiddleware, adminController.getAllUsers);
router.get('/users/:id', adminMiddleware, adminController.getUserById);
router.put('/users/:id/role', adminMiddleware, adminController.updateUserRole);
router.put('/users/:id/status', adminMiddleware, adminController.updateUserStatus);
router.delete('/users/:id', adminMiddleware, adminController.deleteUser);

// Order Management
router.get('/orders', csMiddleware, adminController.getAllOrders);
router.get('/orders/:id', csMiddleware, adminController.getOrderById);
router.put('/orders/:id/status', csMiddleware, adminController.updateOrderStatus);
router.put('/orders/:id/shipping', csMiddleware, adminController.updateShippingInfo);

// Product Management
router.post('/products', mdMiddleware, adminController.createProduct);
router.put('/products/:id', mdMiddleware, adminController.updateProduct);
router.delete('/products/:id', mdMiddleware, adminController.deleteProduct);

// Review Management
router.get('/reviews', mdMiddleware, adminController.getAllReviews);
router.put('/reviews/:id/status', mdMiddleware, adminController.updateReviewStatus);
router.delete('/reviews/:id', mdMiddleware, adminController.deleteReview);

// Analytics
router.get('/analytics', adminMiddleware, adminController.getAnalytics);

module.exports = router;

