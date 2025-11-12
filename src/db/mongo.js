// src/db/mongo.js (CommonJS, native driver only)
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri || !uri.startsWith('mongodb')) {
  throw new Error('MONGO_URI missing or malformed in .env');
}

let client;

async function connectDb() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
    });
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
  }
  // Explicitly select your DB by name (matches your Atlas screenshot)
  const db = client.db('FullStackCW1');
  return {
    db,
    lessons: db.collection('lesson'),
    orders: db.collection('order')
  };
}

module.exports = { connectDb };
