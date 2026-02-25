const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateHint(assignment, userQuery, errorMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a SQL tutor. Give HINTS only, NEVER solutions.

ASSIGNMENT: ${assignment.question}
TABLES: ${assignment.sampleTables.map(t => t.tableName).join(', ')}

USER QUERY: ${userQuery || '[empty]'}

${errorMessage ? `ERROR: ${errorMessage}` : ''}

RULES:
- NEVER write SQL code
- Ask guiding questions only
- 2-3 sentences maximum
- Mention concepts (WHERE, JOIN, GROUP BY) without showing syntax

HINT:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
    
  } catch (error) {
    console.error('LLM error:', error);
    return 'Think about what columns you need and how to filter the data. What condition would select the right rows?';
  }
}

module.exports = { generateHint };