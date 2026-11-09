import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import request from 'supertest';
import {seedData} from './scripts/seedData.js';

process.env.JWT_SECRET='test-only-secret-with-at-least-thirty-two-characters';
process.env.USE_IN_MEMORY_DB='true';
const {app}=await import('./server.js');
let database;
before(async()=>{database=await MongoMemoryServer.create();await mongoose.connect(database.getUri());await seedData({adminEmail:'admin@example.test',adminPassword:'strong-test-password'})});
after(async()=>{await mongoose.disconnect();await database?.stop()});

test('health and seeded catalog',async()=>{
  const health=await request(app).get('/api/health').expect(200);
  assert.equal(health.body.database,'connected');
  const catalog=await request(app).get('/api/products').expect(200);
  assert.equal(catalog.body.total,9);
  assert.equal(catalog.body.items.length,9);
  const luxury=await request(app).get('/api/products?category=luxury&q=Meridian').expect(200);
  assert.equal(luxury.body.total,1);
  assert.equal(luxury.body.items[0].slug,'meridian');
  await request(app).get('/api/products/meridian').expect(200);
  await request(app).get('/api/products/does-not-exist').expect(404);
});

test('customer registration and admin boundaries',async()=>{
  const customer=request.agent(app);
  const registered=await customer.post('/api/auth/register').send({name:'A Customer',email:'customer@example.test',password:'long-safe-password'}).expect(201);
  assert.equal(registered.body.user.role,'customer');
  assert.equal(registered.body.user.passwordHash,undefined);
  await customer.get('/api/auth/me').expect(200);
  await customer.post('/api/products').field('product',JSON.stringify({name:'Forbidden',slug:'forbidden',category:'luxury',price:1,description:'Not allowed'})).expect(403);
  await customer.post('/api/auth/logout').expect(200);
  await customer.get('/api/auth/me').expect(401);
  const admin=request.agent(app);
  await admin.post('/api/auth/login').send({email:'admin@example.test',password:'strong-test-password'}).expect(200);
  const created=await admin.post('/api/products').field('product',JSON.stringify({name:'Test Piece',slug:'test-piece',category:'vintage',price:1200,description:'A test watch',stock:1})).expect(201);
  await admin.put(`/api/products/${created.body._id}`).field('product',JSON.stringify({price:1250})).expect(200);
  await admin.delete(`/api/products/${created.body._id}`).expect(200);
  await admin.get('/api/products/test-piece').expect(404);
});

test('visits, contact validation and newsletter',async()=>{
  const visitor=request.agent(app);
  const first=await visitor.post('/api/visitors').expect(200);
  const repeat=await visitor.post('/api/visitors').expect(200);
  assert.equal(first.body.count,repeat.body.count);
  await request(app).post('/api/contact').send({name:'A',email:'bad',message:'short'}).expect(400);
  await request(app).post('/api/contact').send({name:'Alberto',email:'hello@example.test',message:'I would like to see the Meridian.'}).expect(201);
  await request(app).post('/api/newsletter').send({email:'bad'}).expect(400);
  await request(app).post('/api/newsletter').send({email:'hello@example.test'}).expect(201);
});

test('admin uploads and removes a local demo image',async()=>{
  const admin=request.agent(app);
  await admin.post('/api/auth/login').send({email:'admin@example.test',password:'strong-test-password'}).expect(200);
  const payload={name:'Image Piece',slug:'image-piece',category:'luxury',price:1300,description:'A watch with an image'};
  const created=await admin.post('/api/products').field('product',JSON.stringify(payload)).attach('images',Buffer.from('test image bytes'),{filename:'watch.png',contentType:'image/png'}).expect(201);
  assert.match(created.body.images[0].url,/^\/api\/uploads\//);
  await request(app).get(created.body.images[0].url).expect(200);
  const edited=await admin.put(`/api/products/${created.body._id}`).field('product',JSON.stringify({removeImageIds:[created.body.images[0].publicId]})).expect(200);
  assert.equal(edited.body.images.length,0);
  await request(app).get(created.body.images[0].url).expect(404);
  await admin.delete(`/api/products/${created.body._id}`).expect(200);
  const stats=await admin.get('/api/admin/stats').expect(200);
  assert.equal(stats.body.products,9);
  assert.ok(stats.body.messages>=1);
  const messages=await admin.get('/api/admin/messages').expect(200);
  assert.ok(messages.body.items.some(item=>item.email==='hello@example.test'));
});
