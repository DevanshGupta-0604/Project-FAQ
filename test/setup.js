import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import server from '../server'; //Express app

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  server.listen(8000); // Start the app after DB connection
});

after(async () => {
  await mongoose.disconnect(); // Disconnect from the DB
  await mongoServer.stop();    // Stop the in-memory server
});

beforeEach(async () => {
  const FAQ = require('../models/FAQ/faqSchema');
  await FAQ.deleteMany({}); // Clear all FAQ entries before each test
});
