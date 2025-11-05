const { prisma } = require('../config/database');

const getAllReviews = async (productId) => {
  const where = productId ? { productId } : {};
  
  return await prisma.review.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const createReview = async (userId, data) => {
  const { productId, rating, comment, images } = data;

  // Check if user has purchased this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      order: { userId },
      productId
    }
  });

  if (!hasPurchased) {
    throw new Error('You can only review products you have purchased');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId
    }
  });

  if (existingReview) {
    throw new Error('You have already reviewed this product');
  }

  return await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      images: images || []
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

const updateReview = async (reviewId, userId, data) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });

  if (!review) {
    throw new Error('Review not found');
  }

  if (review.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

const deleteReview = async (reviewId, userId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });

  if (!review) {
    throw new Error('Review not found');
  }

  if (review.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.review.delete({
    where: { id: reviewId }
  });
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
};

