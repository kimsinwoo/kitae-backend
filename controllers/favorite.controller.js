const favoriteService = require('../services/favorite.service');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getFavorites(req.user.id);
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    const favorite = await favoriteService.addFavorite(req.user.id, productId);
    res.status(201).json({
      success: true,
      data: favorite,
      message: 'Added to favorites'
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Product already in favorites') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await favoriteService.removeFavorite(req.user.id, productId);
    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    if (error.message === 'Favorite not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    const result = await favoriteService.toggleFavorite(req.user.id, productId);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
};

