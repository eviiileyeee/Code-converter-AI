const { convertCodeWithGemini, getSupportedLanguagesList } = require('../services/codeConversionService');
const { logger } = require('../utils/logger');
const { CustomError } = require('../utils/errors');

/**
 * Convert code from one programming language to another
 */
const convertCode = async (req, res, next) => {
  try {
    const { sourceCode, sourceLanguage, targetLanguage, preserveComments, optimizeCode } = req.body;
    
    logger.info(`Converting code from ${sourceLanguage} to ${targetLanguage}`);
    
    const result = await convertCodeWithGemini(
      sourceCode, 
      sourceLanguage, 
      targetLanguage, 
      preserveComments, 
      optimizeCode
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

module.exports = {
  convertCode,
  getSupportedLanguages
};