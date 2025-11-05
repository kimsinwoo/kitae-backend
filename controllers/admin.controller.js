const adminService = require('../services/admin.service');

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await adminService.updateUserRole(id, role);
    res.json({
      success: true,
      data: user,
      message: 'User role updated'
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.updateUser(id, req.body);
    res.json({
      success: true,
      data: user,
      message: 'User updated'
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id);
    res.json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await adminService.getAllOrders();
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await adminService.getOrderById(id);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const order = await adminService.updateOrderStatus(id, status, paymentStatus);
    res.json({
      success: true,
      data: order,
      message: 'Order status updated'
    });
  } catch (error) {
    next(error);
  }
};

const updateShippingInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await adminService.updateShippingInfo(id, req.body);
    res.json({
      success: true,
      data: order,
      message: 'Shipping info updated'
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    console.log('📝 Create product request:', { body: req.body, userId: req.user?.id });
    const product = await adminService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created'
    });
  } catch (error) {
    console.error('❌ Create product error:', error.message);
    console.error('❌ Error stack:', error.stack);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await adminService.updateProduct(id, req.body);
    res.json({
      success: true,
      data: product,
      message: 'Product updated'
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteProduct(id);
    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await adminService.getAllReviews();
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await adminService.updateReview(id, req.body);
    res.json({
      success: true,
      data: review,
      message: 'Review updated'
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteReview(id);
    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.getAnalytics();
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateShippingInfo,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  getAnalytics
};

