const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function convertCode(code, fromLanguage, toLanguage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Convert the following ${fromLanguage} code to ${toLanguage}. Provide only the converted code without any explanations:\n\n${code}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const convertedCode = response.text();
    
    return convertedCode.trim();
  } catch (error) {
    console.error('Error in code conversion:', error);
    throw new Error('Failed to convert code. Please try again.');
  }
}

module.exports = {
  convertCode
}; 