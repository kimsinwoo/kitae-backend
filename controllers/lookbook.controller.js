const lookbookService = require('../services/lookbook.service');

const getAllLookbooks = async (req, res, next) => {
  try {
    const lookbooks = await lookbookService.getAllLookbooks();
    res.json({
      success: true,
      data: lookbooks
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedLookbooks = async (req, res, next) => {
  try {
    const lookbooks = await lookbookService.getFeaturedLookbooks();
    res.json({
      success: true,
      data: lookbooks
    });
  } catch (error) {
    next(error);
  }
};

const getLookbookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lookbook = await lookbookService.getLookbookById(id);
    res.json({
      success: true,
      data: lookbook
    });
  } catch (error) {
    next(error);
  }
};

const createLookbook = async (req, res, next) => {
  try {
    const lookbook = await lookbookService.createLookbook(req.body);
    res.status(201).json({
      success: true,
      data: lookbook,
      message: 'Lookbook created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateLookbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lookbook = await lookbookService.updateLookbook(id, req.body);
    res.json({
      success: true,
      data: lookbook,
      message: 'Lookbook updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteLookbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lookbookService.deleteLookbook(id);
    res.json({
      success: true,
      message: 'Lookbook deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLookbooks,
  getFeaturedLookbooks,
  getLookbookById,
  createLookbook,
  updateLookbook,
  deleteLookbook
};

