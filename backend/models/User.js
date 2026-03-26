const { getDB } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createUser(email, password) {
  const db = getDB();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await users.insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date(),
    solvedAssignments: []
  });

  return { id: result.insertedId, email };
}

async function findUserByEmail(email) {
  const db = getDB();
  return db.collection('users').findOne({ email });
}

module.exports = { createUser, findUserByEmail };