const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;

async function connectMongoDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || 'ciphersqlstudio');
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
   //  process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error('Database not connected');
  return db;
}

function getCollection(name) {
  return getDB().collection(name);
}

module.exports = { connectMongoDB, getDB, getCollection };