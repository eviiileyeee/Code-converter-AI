const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { validateConversionRequest } = require('../middleware/validationMiddleware');
const { codeConversionRateLimit, addRateLimitInfo } = require('../middleware/rateLimitMiddleware');

/**
 * @route POST /api/code/convert
 * @desc Convert code from one language to another
 * @access Public
 */
router.post('/convert', codeConversionRateLimit, addRateLimitInfo, validateConversionRequest, codeController.convertCode);

/**
 * @route GET /api/code/supported-languages
 * @desc Get list of supported programming languages
 * @access Public
 */
router.get('/supported-languages', codeController.getSupportedLanguages);

/**
 * @route GET /api/code/rate-limits
 * @desc Get information about rate limits for code conversion
 * @access Public
 */
router.get('/rate-limits', codeController.getRateLimitInfo);

module.exports = router;