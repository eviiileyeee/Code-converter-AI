const { convertCodeWithGemini, getSupportedLanguagesList } = require('../services/codeConversionService');
const { CustomError } = require('../utils/errors');

/**
 * Convert code from one programming language to another
 */
const convertCode = async (req, res, next) => {
  try {
    const { sourceCode, sourceLanguage, targetLanguage, preserveComments, optimizeCode, userPrompt } = req.body;
    
    
    const result = await convertCodeWithGemini(
      sourceCode, 
      sourceLanguage, 
      targetLanguage, 
      preserveComments, 
      optimizeCode,
      userPrompt
    );
    
    return res.status(200).json({
      status: 'success',
      data: {
        convertedCode: result.convertedCode,
        explanations: result.explanations,
        warnings: result.warnings,
        metadata: {
          sourceLanguage,
          targetLanguage,
          preserveComments,
          optimizeCode,
          userPrompt,
          codeLength: sourceCode.length,
          conversionTime: result.conversionTime
        }
      }
    });
  } catch (error) {
    // Forward to error handler middleware  
    next(error);
  }
};

/**
 * Get list of supported programming languages
 */
const getSupportedLanguages = async (req, res, next) => {
  try {
    const languages = getSupportedLanguagesList();
    
    return res.status(200).json({
      status: 'success',
      data: {
        supportedLanguages: languages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get information about rate limits for code conversion
 */
const getRateLimitInfo = async (req, res, next) => {
  try {
    const rateLimitInfo = {
      endpoint: '/api/code/convert',
      method: 'POST',
      limit: 20,
      windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      windowDescription: '24 hours',
      description: 'Rate limit for code conversion requests',
      headers: {
        'X-RateLimit-Limit': 'Total number of requests allowed per window',
        'X-RateLimit-Remaining': 'Number of requests remaining in current window',
        'X-RateLimit-Reset': 'Timestamp when the rate limit window resets'
      },
      responseBody: {
        rateLimit: 'Object containing remaining requests, limit, and reset time'
      },
      errorResponse: {
        status: 429,
        message: 'Rate limit exceeded error with remaining count and reset time'
      }
    };
    console.log("request on limiter")
    return res.status(200).json({
      status: 'success',
      data: {
        rateLimits: rateLimitInfo
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  convertCode,
  getSupportedLanguages,
  getRateLimitInfo
};