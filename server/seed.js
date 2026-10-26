import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase, seedCatalogue } from './database.js';
try { await connectDatabase(process.env.MONGODB_URI); console.log(`Seeded ${await seedCatalogue()} product references.`); }
catch { console.error('Seeding failed. Check MONGODB_URI and database availability.'); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
