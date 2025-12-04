const { prisma } = require('../config/database');

const getAllProducts = async (filters = {}) => {
  const { page = 1, limit = 20, category, gender, status, featured } = filters;
  
  const where = {};
  
  // category는 slug 또는 ID 모두 지원
  if (category) {
    // slug인지 ID인지 확인
    const categoryRecord = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: category },
          { id: category }
        ]
      }
    });
    if (categoryRecord) {
      where.categoryId = categoryRecord.id;
    }
  }
  
  if (gender) where.gender = gender;
  if (status) where.status = status;
  if (featured !== undefined) where.featured = featured;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
        _count: {
          select: { reviews: true }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const getFeaturedProducts = async () => {
  return await prisma.product.findMany({
    where: {
      featured: true,
      status: 'active'
    },
    include: {
      category: true,
      variants: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: { reviews: true }
      }
    }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Calculate average rating
  if (product.reviews.length > 0) {
    const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
    product.averageRating = Number(avgRating.toFixed(1));
  } else {
    product.averageRating = 0;
  }

  return product;
};

// Product variant를 size와 color로 찾기
const getVariantBySizeAndColor = async (productId, size, color) => {
  // 먼저 product가 존재하는지 확인
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: true
    }
  });

  if (!product) {
    const error = new Error(`Product not found: ${productId}`);
    error.statusCode = 404;
    throw error;
  }

  // 대소문자 구분 없이 찾기 위해 모든 variant를 가져와서 필터링
  const variant = product.variants.find(
    v => v.size.toLowerCase() === size.toLowerCase() && 
         v.color.toLowerCase() === color.toLowerCase()
  );

  if (!variant) {
    // 사용 가능한 variant 목록을 포함한 에러 메시지
    const availableVariants = product.variants.map(v => `${v.size}/${v.color}`).join(', ');
    const error = new Error(
      `Variant not found for product ${productId} with size ${size} and color ${color}. ` +
      `Available variants: ${availableVariants || 'none'}`
    );
    error.statusCode = 404;
    error.availableVariants = product.variants;
    throw error;
  }

  // variant와 product 정보를 함께 반환
  return {
    ...variant,
    product
  };
};

const searchProducts = async (searchTerm, pagination = {}) => {
  const { page = 1, limit = 20 } = pagination;
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { nameEn: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { sku: { contains: searchTerm } }
    ]
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true
      },
      skip,
      take: limit
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const getProductReviews = async (productId) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const createProduct = async (data) => {
  const { variants, ...productData } = data;
  
  return await prisma.product.create({
    data: {
      ...productData,
      variants: {
        create: variants || []
      }
    },
    include: {
      category: true,
      variants: true
    }
  });
};

const updateProduct = async (id, data) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new Error('Product not found');
  }

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
    },
    include: {
      category: true,
      variants: true
    }
  });
};

const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  await prisma.product.delete({
    where: { id }
  });
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getVariantBySizeAndColor,
  searchProducts,
  getProductReviews,
  createProduct,
  updateProduct,
  deleteProduct
};

