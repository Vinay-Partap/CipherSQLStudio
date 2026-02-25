const { getCollection } = require('../config/database');
const { ObjectId } = require('mongodb');

class Assignment {
  static collection() {
    return getCollection('assignments');
  }

  static async findAll() {
    return await this.collection().find().toArray();
  }

  static async findById(id) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async create(data) {
    const result = await this.collection().insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }
}

module.exports = Assignment;