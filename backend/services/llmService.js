const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateHint(assignment, userQuery, errorMessage, hintLevel = 1) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const levelPrompts = {
      1: `You are a SQL tutor giving a LEVEL 1 hint (very gentle nudge).
- Ask ONE guiding question only
- Do NOT mention any SQL keywords or clauses
- Maximum 2 sentences
- Make them think about WHAT they need, not HOW`,

      2: `You are a SQL tutor giving a LEVEL 2 hint (concept hint).
- Mention which SQL concept/clause they need (WHERE, JOIN, GROUP BY etc)
- Do NOT show any SQL syntax or code
- Maximum 3 sentences
- Give a conceptual explanation of what that clause does`,

      3: `You are a SQL tutor giving a LEVEL 3 hint (detailed hint).
- Explain the exact approach step by step
- You CAN mention column names and table names
- Still do NOT write the full SQL query
- Maximum 4 sentences
- This should make the solution very clear`
    };

    const prompt = `${levelPrompts[hintLevel]}

ASSIGNMENT: ${assignment.question}
TABLES: ${assignment.sampleTables.map(t =>
  `${t.tableName}(${t.columns.map(c => c.columnName).join(', ')})`
).join(' | ')}

USER QUERY: ${userQuery || '[empty - user has not written anything yet]'}
${errorMessage ? `ERROR IN QUERY: ${errorMessage}` : ''}

HINT (level ${hintLevel}):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error('LLM error:', error);
    const fallbacks = {
      1: 'What information are you trying to retrieve? Think about which rows you need.',
      2: 'Think about using a WHERE clause to filter rows based on a condition.',
      3: 'Use WHERE clause with the salary column. Compare it to 50000 using the > operator.'
    };
    return fallbacks[hintLevel] || fallbacks[1];
  }
}

module.e