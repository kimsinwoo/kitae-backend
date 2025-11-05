const { prisma } = require('../config/database');

const getDashboard = async () => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalOrders,
    totalProducts,
    todaySales,
    monthSales,
    recentOrders,
    recentUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfDay } },
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { total: true }
    }),
    prisma.order.findMany({
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
        items: { take: 3 }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
      todaySales: todaySales._sum.total || 0,
      monthSales: monthSales._sum.total || 0
    },
    recentOrders,
    recentUsers
  };
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      },
      favorites: {
        take: 10,
        include: { product: true }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUserRole = async (id, role) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  return await prisma.user.update({
    where: { id },
    data: { role }
  });
};

const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  return await prisma.user.update({
    where: { id },
    data
  });
};

const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id } });
};

const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  });
};

const updateOrderStatus = async (id, status, paymentStatus) => {
  return await prisma.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus })
    }
  });
};

const updateShippingInfo = async (id, data) => {
  return await prisma.order.update({
    where: { id },
    data
  });
};

const createProduct = async (data) => {
  try {
    console.log('🔑 Creating product with data:', JSON.stringify(data, null, 2));
    const { variants, ...productData } = data;
    console.log('🔑 Product data:', productData);
    console.log('🔑 Variants:', variants);
    
    const result = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants || []
        }
      },
      include: {
        variants: true
      }
    });
    
    console.log('✅ Product created successfully:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Failed to create product:', error.message);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
};

const updateProduct = async (id, data) => {
  const { variants, ...productData } = data;
  return await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(variants && {
        variants: {
          deleteMany: {},
          create: variants
        }
      })
    }
  });
};

const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
};

const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const updateReview = async (id, data) => {
  return await prisma.review.update({
    where: { id },
    data
  });
};

const deleteReview = async (id) => {
  await prisma.review.delete({ where: { id } });
};

const getAnalytics = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [revenue, orders, users] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: thirtyDaysAgo } },
      _sum: { total: true }
    }),
    prisma.order.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    }),
    prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    })
  ]);

  return {
    revenue: revenue._sum.total || 0,
    orders,
    users
  };
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateShippingInfo,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  updateReview,
  deleteReview,
  getAnalytics
};

