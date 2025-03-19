// File: middleware/validationMiddleware.js
const Joi = require('joi');
const { CustomError } = require('../utils/errors');

// Validation schema for code conversion request
const conversionSchema = Joi.object({
  sourceCode: Joi.string().required().max(10000).messages({
    'string.empty': 'Source code cannot be empty',
    'string.max': 'Source code exceeds maximum length of 10,000 characters',
    'any.required': 'Source code is required'
  }),
  sourceLanguage: Joi.string().required().messages({
    'string.empty': 'Source language cannot be empty',
    'any.required': 'Source language is required'
  }),
  targetLanguage: Joi.string().required().messages({
    'string.empty': 'Target language cannot be empty',
    'any.required': 'Target language is required'
  }),
  preserveComments: Joi.boolean().default(true),
  optimizeCode: Joi.boolean().default(false)
});

/**
 * Validate code conversion request
 */
const validateConversionRequest = (req, res, next) => {
  const { error, value } = conversionSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new CustomError(errorMessage, 400));
  }
  
  // Update request with validated data
  req.body = value;
  next();
};

module.exports = {
  validateConversionRequest
};
