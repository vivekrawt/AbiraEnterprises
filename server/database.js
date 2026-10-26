import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import { Product, Enquiry } from './models.js';
mongoose.set('bufferCommands', false);
export async function connectDatabase(uri) {
  if (!uri) throw new Error('Set MONGODB_URI in .env before starting the server.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await Promise.all([Product.init(), Enquiry.init()]);
}
export async function seedCatalogue() {
  const data = JSON.parse((await fs.readFile(new URL('./data/catalogue.json', import.meta.url),'utf8')).replace(/^\uFEFF/,''));
  await Product.bulkWrite(data.map(product => ({ updateOne: { filter: { id: product.id }, update: { $set: product }, upsert: true } })));
  return data.length;
}
