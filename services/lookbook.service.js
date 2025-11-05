const { prisma } = require('../config/database');

const getAllLookbooks = async () => {
  return await prisma.lookbook.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getFeaturedLookbooks = async () => {
  return await prisma.lookbook.findMany({
    where: { featured: true },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getLookbookById = async (id) => {
  const lookbook = await prisma.lookbook.findUnique({
    where: { id }
  });

  if (!lookbook) {
    throw new Error('Lookbook not found');
  }

  return lookbook;
};

const createLookbook = async (data) => {
  return await prisma.lookbook.create({
    data
  });
};

const updateLookbook = async (id, data) => {
  const lookbook = await prisma.lookbook.findUnique({
    where: { id }
  });

  if (!lookbook) {
    throw new Error('Lookbook not found');
  }

  return await prisma.lookbook.update({
    where: { id },
    data
  });
};

const deleteLookbook = async (id) => {
  const lookbook = await prisma.lookbook.findUnique({
    where: { id }
  });

  if (!lookbook) {
    throw new Error('Lookbook not found');
  }

  await prisma.lookbook.delete({
    where: { id }
  });
};

module.exports = {
  getAllLookbooks,
  getFeaturedLookbooks,
  getLookbookById,
  createLookbook,
  updateLookbook,
  deleteLookbook
};

