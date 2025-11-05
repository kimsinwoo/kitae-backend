const reviewService = require('../services/review.service');

const getAllReviews = async (req, res, next) => {
  try {
    const { productId } = req.query;
    const reviews = await reviewService.getAllReviews(productId);
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.updateReview(id, req.user.id, req.body);
    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(id, req.user.id);
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
};

