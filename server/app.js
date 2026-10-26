import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { z } from 'zod';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Product, Enquiry } from './models.js';
import { collections } from '../shared/collections.js';

const field = max => z.string().trim().max(max).optional().default('');
const enquiryInput = z.object({
  requestId: z.uuid(), name: z.string().trim().min(1).max(100),
  business: field(100), email: z.email().max(150), phone: field(30),
  collection: z.enum([...collections.map(c => c.title), 'A little of everything']),
  quantity: z.number().int().min(1).max(100000000).nullable().optional().default(null), details: field(3000)
}).strict();

export function createApp({ clientOrigin = process.env.CLIENT_ORIGIN, production = process.env.NODE_ENV === 'production', enquiryLimit = 10 } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', Number(process.env.TRUST_PROXY || 0));
  app.use(helmet({ contentSecurityPolicy: production ? { directives: {
    defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'], imgSrc: ["'self'", 'data:'], connectSrc: ["'self'"],
    upgradeInsecureRequests: null
  }} : false, strictTransportSecurity: production ? undefined : false }));
  if (clientOrigin) app.use('/api', cors({ origin: clientOrigin, methods: ['GET','POST'] }));
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/health', (req,res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable' }));
  app.get('/api/collections', (req,res) => res.json(collections));
  const requireDatabase = (req,res,next) => mongoose.connection.readyState === 1 ? next() : res.status(503).json({ message: 'The service is temporarily unavailable. Please try again shortly.' });
  app.get('/api/products', requireDatabase, async (req,res) => {
    const query = z.object({ collection: z.enum(collections.map(c => c.id)).optional() }).strict().safeParse(req.query);
    if (!query.success) return res.status(400).json({ message: 'Choose a valid collection.' });
    const { collection } = query.data;
    const filter = collection ? { category: collections.find(c => c.id === collection).folder } : {};
    res.json(await Product.find(filter).sort({id:1}).select('-_id').lean());
  });
  app.post('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: enquiryLimit, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many enquiries. Please try again in 15 minutes.' } }), requireDatabase, async (req,res) => {
    const parsed = enquiryInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Please check your enquiry details.', errors: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) });
    try {
      const { collection, ...details } = parsed.data;
      const enquiry = await Enquiry.create({ ...details, selectedCollection: collection });
      res.status(201).json({ reference: enquiry.id, message: 'Your enquiry has been received.' });
    } catch (error) {
      // Retrying the same request after a lost response never creates a second enquiry.
      if (error.code === 11000) return res.status(200).json({ message: 'This enquiry has already been received.' });
      throw error;
    }
  });
  // There is deliberately no public endpoint that lists customers or enquiries.
  app.use('/api', (req,res) => res.status(404).json({ message: 'API endpoint not found.' }));
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  if (fs.existsSync(path.join(dist,'index.html'))) {
    app.use(express.static(dist));
    app.get('/', (req,res) => res.sendFile(path.join(dist,'index.html')));
  }
  app.use((req,res) => res.status(404).json({ message: 'Not found.' }));
  app.use((error,req,res,next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON.' });
    if (error.type === 'entity.too.large') return res.status(413).json({ message: 'The enquiry is too large.' });
    console.error('API request failed:', error.name);
    res.status(503).json({ message: 'Your request could not be completed. Please try again.' });
  });
  return app;
}
