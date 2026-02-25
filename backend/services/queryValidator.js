const BLOCKED_KEYWORDS = [
    'DROP DATABASE',
    'DROP SCHEMA PUBLIC',
    'DELETE FROM PG_',
    'INSERT INTO PG_',
    'UPDATE PG_',
    'CREATE USER',
    'ALTER USER',
    'GRANT ALL ON PG_',
    'COPY PG_',
    '\\COPY',
    'EXECUTE IMMEDIATE',
    'PREPARE'
  ];
  
  function validateQuery(query) {
    const upperQuery = query.toUpperCase();
    
    for (const keyword of BLOCKED_KEYWORDS) {
      if (upperQuery.includes(keyword.toUpperCase())) {
        throw new Error(`Blocked: ${keyword}`);
      }
    }
    
    return query.trim();
  }
  
  module.exports = { validateQuery };