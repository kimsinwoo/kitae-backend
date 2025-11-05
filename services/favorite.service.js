const { prisma } = require('../config/database');

const getFavorites = async (userId) => {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          variants: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const addFavorite = async (userId, productId) => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Check if already favorited
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existing) {
    throw new Error('Product already in favorites');
  }

  return await prisma.favorite.create({
    data: { userId, productId },
    include: {
      product: {
        include: {
          category: true,
          variants: true
        }
      }
    }
  });
};

const removeFavorite = async (userId, productId) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (!favorite) {
    throw new Error('Favorite not found');
  }

  await prisma.favorite.delete({
    where: { id: favorite.id }
  });

  return { success: true };
};

const toggleFavorite = async (userId, productId) => {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existing) {
    await removeFavorite(userId, productId);
    return { isFavorite: false, message: 'Removed from favorites' };
  } else {
    await addFavorite(userId, productId);
    return { isFavorite: true, message: 'Added to favorites' };
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
};

