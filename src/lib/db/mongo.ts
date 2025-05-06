import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let client: MongoClient;
export let clientPromise: Promise<MongoClient>;

declare global {
 
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
