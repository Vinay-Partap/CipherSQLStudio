const { createWorkspaceSchema, setupAssignmentData } = require('../config/postgres');
const { validateQuery } = require('./queryValidator');

async function executeUserQuery(sessionId, assignment, userQuery) {
  const { client, schemaName } = await createWorkspaceSchema(sessionId);
  
  try {
    // Setup sandbox
    await setupAssignmentData(client, schemaName, assignment.sampleTables);
    
    // Start transaction
    await client.query('BEGIN');
    
    // Validate and execute
    const safeQuery = validateQuery(userQuery);
    
    // Set search path again for safety
    await client.query(`SET search_path TO ${schemaName}`);
    
    const result = await client.query(safeQuery);
    
    // Rollback to prevent persistent changes
    await client.query('ROLLBACK');
    
    return {
      success: true,
      columns: result.fields.map(f => f.name),
      rows: result.rows,
      rowCount: result.rowCount
    };
    
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (e) {
      // ignore rollback error
    }
    
    return {
      success: false,
      error: error.message
    };
  } finally {
    client.release();
  }
}

module.exports = { executeUserQuery };