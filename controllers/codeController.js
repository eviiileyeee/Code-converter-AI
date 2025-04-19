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

module.exports = {
  convertCode,
  getSupportedLanguages
};