const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { validateConversionRequest } = require('../middleware/validationMiddleware');

/**
 * @route POST /api/code/convert
 * @desc Convert code from one language to another
 * @access Public
 */
router.post('/convert', validateConversionRequest, codeController.convertCode);

/**
 * @route GET /api/code/supported-languages
 * @desc Get list of supported programming languages
 * @access Public
 */
router.get('/supported-languages', codeController.getSupportedLanguages);

module.exports = router;