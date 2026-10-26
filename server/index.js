import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase, seedCatalogue } from './database.js';
import { createApp } from './app.js';
try {
  await connectDatabase(process.env.MONGODB_URI);
  await seedCatalogue();
  const port = Number(process.env.PORT || 5000);
  const server = createApp().listen(port, () => console.log(`Abira API and production website: http://localhost:${port}`));
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(async () => { await mongoose.disconnect(); process.exit(0); }));
} catch (error) {
  console.error(error.name === 'MongooseServerSelectionError' ? 'MongoDB is unavailable. Start MongoDB or set a working MONGODB_URI in .env.' : 'Startup failed. Check MONGODB_URI and database permissions.');
  await mongoose.disconnect(); process.exit(1);
}
