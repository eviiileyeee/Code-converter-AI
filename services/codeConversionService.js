const { GoogleGenerativeAI } = require('@google/generative-ai');
const { logger } = require('../utils/logger');
const { CustomError } = require('../utils/errors');
require('dotenv').config();
// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// Supported language map for validation
const SUPPORTED_LANGUAGES = {
  'javascript': ['Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'python': ['JavaScript', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'java': ['JavaScript', 'Python', 'TypeScript', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'c#': ['JavaScript', 'Python', 'TypeScript', 'Java', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'typescript': ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'ruby': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'go': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'rust': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'C++', 'PHP', 'Kotlin'],
  'c++': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Kotlin'],
  'php': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'Kotlin'],
  'kotlin': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP']
};

/**
 * Convert source code to target language using Gemini AI
 */
async function convertCodeWithGemini(
  sourceCode, 
  sourceLanguage, 
  targetLanguage, 
  preserveComments = true, 
  optimizeCode = false,
  userPrompt = ''
) {
  const startTime = Date.now();
  
  try {
    // Source language validation (case-insensitive)
    sourceLanguage = sourceLanguage.toLowerCase();
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(sourceLanguage)) {
      throw new CustomError(`Source language '${sourceLanguage}' is not supported`, 400);
    }
    
    // Target language validation (case-insensitive)
    const normalizedTargetLang = targetLanguage.toLowerCase();
    const supportedTargets = SUPPORTED_LANGUAGES[sourceLanguage].map(lang => lang.toLowerCase());
    
    if (!supportedTargets.includes(normalizedTargetLang)) {
      throw new CustomError(`Conversion from '${sourceLanguage}' to '${targetLanguage}' is not supported`, 400);
    }
    
    // Build prompt with instructions
    const prompt = `
    You are an expert code translator. 
    Convert the following ${sourceLanguage} code to ${targetLanguage}.
    
    ${preserveComments ? 'Preserve all comments and documentation.' : 'Only include essential comments in the output.'}
    ${optimizeCode ? 'Optimize the code for the target language, using language-specific idioms and best practices.' : 'Keep the code structure as close to the original as possible.'}
    ${userPrompt ? `Additionally, follow these specific instructions: ${userPrompt}` : ''}
    
    Return the result in this JSON format:
    {
      "convertedCode": "the full converted code here",
      "explanations": [
        "explanation of key conversion decisions or changes",
        "explanation of any idioms or patterns used"
      ],
      "warnings": [
        "any potential issues with the conversion",
        "functionality that might not translate directly"
      ]
    }
    
    Only return valid JSON without any explanations or additional text.
    
    SOURCE CODE (${sourceLanguage}):
    \`\`\`
    ${sourceCode}
    \`\`\`
    `;

    logger.debug(`Sending code conversion request to Gemini API`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    let jsonStart = text.indexOf('{');
    let jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new CustomError("Failed to get valid JSON response from Gemini", 500);
    }
    
    const jsonText = text.substring(jsonStart, jsonEnd);
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      logger.error(`Failed to parse Gemini response: ${parseError.message}`);
      throw new CustomError("Failed to parse the AI response", 500);
    }
    
    // Validate response structure
    if (!parsedResponse.convertedCode) {
      throw new CustomError("AI response missing converted code", 500);
    }
    
    const conversionTime = Date.now() - startTime;
    
    // Return conversion result
    return {
      convertedCode: parsedResponse.convertedCode,
      explanations: parsedResponse.explanations || [],
      warnings: parsedResponse.warnings || [],
      conversionTime
    };
  } catch (error) {
    logger.error(`Code conversion error: ${error.message}`);
    
    // Handle API-specific errors
    if (error.response) {
      throw new CustomError(`Gemini API error: ${error.response.data.error.message}`, 500);
    }
    
    // Rethrow custom errors
    if (error instanceof CustomError) {
      throw error;
    }
    
    // Handle unexpected errors
    throw new CustomError(`Code conversion failed: ${error.message}`, 500);
  }
}

/**
 * Get list of supported languages and their possible conversions
 */
function getSupportedLanguagesList() {
  return Object.entries(SUPPORTED_LANGUAGES).map(([source, targets]) => ({
    language: source,
    canConvertTo: targets
  }));
}

module.exports = {
  convertCodeWithGemini,
  getSupportedLanguagesList,
  SUPPORTED_LANGUAGES
};
