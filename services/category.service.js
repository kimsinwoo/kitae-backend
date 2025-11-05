const { prisma } = require('../config/database');

const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('📁 Found categories:', categories.length);
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
};

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          variants: true
        }
      }
    }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const createCategory = async (data) => {
  return await prisma.category.create({
    data
  });
};

const updateCategory = async (id, data) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return await prisma.category.update({
    where: { id },
    data
  });
};

const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  await prisma.category.delete({
    where: { id }
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

