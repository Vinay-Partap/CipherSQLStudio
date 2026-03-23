const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Create isolated schema for session
async function createWorkspaceSchema(sessionId) {
  const schemaName = `workspace_${sessionId.replace(/-/g, '_').substring(0, 20)}`;
  const client = await pool.connect();
  
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    await client.query(`SET search_path TO ${schemaName}`);
    return { client, schemaName };
  } catch (err) {
    client.release();
    throw err;
  }
}

// Setup tables and data for assignment
async function setupAssignmentData(client, schemaName, sampleTables) {
  for (const table of sampleTables) {
    const columns = table.columns
      .map(c => `"${c.columnName}" ${c.dataType}`)
      .join(', ');
    
    // Create table
    await client.query(`
      DROP TABLE IF EXISTS ${schemaName}."${table.tableName}"
    `);
    
    await client.query(`
      CREATE TABLE ${schemaName}."${table.tableName}" (${columns})
    `);
    
    // Insert sample data
    if (table.rows && table.rows.length > 0) {
      const keys = Object.keys(table.rows[0]);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      for (const row of table.rows) {
        const values = keys.map(k => row[k]);
        await client.query(`
          INSERT INTO ${schemaName}."${table.tableName}" (${keys.map(k => `"${k}"`).join(', ')})
          VALUES (${placeholders})
        `, values);
      }
    }
  }
}

module.exports = {
  pool,
  createWorkspaceSchema,
  setupAssignmentData
};