import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDatabase, seedCatalogue } from '../database.js';
import { Product, Enquiry } from '../models.js';
let mongo, app;
const valid = () => ({ requestId:randomUUID(), name:'Test Buyer', email:'test@example.com', business:'Test Brand', phone:'', collection:'Corrugated Boxes', quantity:500, details:'Printed mailer 20 × 15 × 8 cm. Reference AB-070.' });
before(async()=>{mongo=await MongoMemoryServer.create();await connectDatabase(mongo.getUri('abira_test'));await seedCatalogue();app=createApp({enquiryLimit:100});});
after(async()=>{await mongoose.disconnect();await mongo?.stop();});
test('catalogue seeding is repeatable and all 112 products are retrievable',async()=>{
  await seedCatalogue();assert.equal(await Product.countDocuments(),112);
  const res=await request(app).get('/api/products').expect(200);assert.equal(res.body.length,112);
  assert.equal((await request(app).get('/api/collections').expect(200)).body.length,6);
  const filtered=await request(app).get('/api/products?collection=corrugated').expect(200);
  assert.equal(filtered.body.length,53);assert.ok(filtered.body.every(p=>p.category==='Corrugated Boxes'));
  await request(app).get('/api/products?collection=unknown').expect(400);
  await request(app).get('/api/products?collection[$ne]=x').expect(400);
});
test('enquiry is actually stored in MongoDB and retries do not duplicate it',async()=>{
  const input=valid();const res=await request(app).post('/api/enquiries').send(input).expect(201);
  const saved=await Enquiry.findById(res.body.reference).lean();assert.equal(saved.email,input.email);assert.equal(saved.quantity,500);assert.equal(saved.status,'new');
  await request(app).post('/api/enquiries').send(input).expect(200);
  assert.equal(await Enquiry.countDocuments({requestId:input.requestId}),1);
});
test('invalid, oversized and injected enquiries are rejected without writes',async()=>{
  const count=await Enquiry.countDocuments();
  for(const fields of [{name:' '},{email:'bad-email'},{quantity:-1},{quantity:1.5},{collection:'Unknown'},{details:'x'.repeat(3001)},{email:{$ne:null}},{status:'closed'}]) await request(app).post('/api/enquiries').send({...valid(),...fields}).expect(400);
  await request(app).post('/api/enquiries').set('Content-Type','application/json').send('{broken').expect(400);
  await request(app).post('/api/enquiries').send({...valid(),details:'x'.repeat(20000)}).expect(413);
  assert.equal(await Enquiry.countDocuments(),count);
});
test('enquiries cannot be publicly listed and posting is rate limited',async()=>{
  await request(app).get('/api/enquiries').expect(404);
  const limited=createApp({enquiryLimit:1});await request(limited).post('/api/enquiries').send(valid()).expect(201);
  await request(limited).post('/api/enquiries').send(valid()).expect(429);
});
test('database outage cannot return a false successful submission',async()=>{
  await mongoose.disconnect();
  await request(app).post('/api/enquiries').send(valid()).expect(503);
  await request(app).get('/api/health').expect(503);
});
