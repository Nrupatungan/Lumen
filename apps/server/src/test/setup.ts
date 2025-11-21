import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryReplSet | null = null;

export async function setupTestDB() {
  mongod = await MongoMemoryReplSet.create({
    binary: { version: '6.0.6' },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

export async function teardownTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
}
