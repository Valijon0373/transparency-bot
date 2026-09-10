import { initDb } from './database.js';

const seedData = async () => {
  await initDb();
  console.log('Database initialized without mock data.');
  process.exit(0);
};

seedData();

