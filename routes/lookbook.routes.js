const express = require('express');
const router = express.Router();
const lookbookController = require('../controllers/lookbook.controller');

router.get('/', lookbookController.getAllLookbooks);
router.get('/featured', lookbookController.getFeaturedLookbooks);
router.get('/:id', lookbookController.getLookbookById);
router.post('/', lookbookController.createLookbook);
router.put('/:id', lookbookController.updateLookbook);
router.delete('/:id', lookbookController.deleteLookbook);

module.exports = router;

