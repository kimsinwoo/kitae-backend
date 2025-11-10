const orderService = require('../services/order.service');

const getOrders = async (req, res, next) => {
  try {
    console.log('📦 Getting orders for user:', req.user.id);
    const orders = await orderService.getUserOrders(req.user.id);
    console.log('✅ Found orders:', orders.length);
    res.json({
      success: true,
      data: {
        orders: orders
      }
    });
  } catch (error) {
    console.error('❌ Failed to get orders:', error);
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.user.id);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    console.log('📦 Creating order request:');
    console.log('  User ID:', req.user.id);
    console.log('  Request body:', JSON.stringify(req.body, null, 2));
    
    const order = await orderService.createOrder(req.user.id, req.body);
    
    console.log('✅ Order created successfully:', order.orderNumber);
    
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('❌ Order creation error:');
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.cancelOrder(id, req.user.id);
    res.json({
      success: true,
      data: order,
      message: 'Order cancelled'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder
};

