require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI environment variable is not set');
}

// Use a global variable to cache the client and the connect promise so the same
// connection is reused across module reloads / serverless invocations.
if (!global._cw1_mongo) {
  global._cw1_mongo = {
    client: new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }),
    connectPromise: null
  };
}

async function connectDb() {
  const cached = global._cw1_mongo;

  if (!cached.connectPromise) {
    // start connection and cache the promise
    cached.connectPromise = cached.client.connect();
  }

  // await the connection to be established
  await cached.connectPromise;

  // db() will use the DB specified in the URI or the driver's default
  const db = cached.client.db();

  return {
    db,
    lessons: db.collection('lesson'),
    orders: db.collection('order')
  };
}

module.exports = { connectDb };
