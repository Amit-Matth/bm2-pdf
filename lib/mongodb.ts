import { MongoClient } from "mongodb";

const options = {};

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

declare global {
  var mongodb: MongoCache | undefined;
}

const cache = globalThis.mongodb ?? { client: null, promise: null };

globalThis.mongodb = cache;

export default async function getMongoClient() {
  if (cache.client) {
    return cache.client;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!cache.promise) {
    const client = new MongoClient(uri, options);
    cache.promise = client.connect();
  }

  cache.client = await cache.promise;
  return cache.client;
}
