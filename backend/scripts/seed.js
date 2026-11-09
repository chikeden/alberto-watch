import 'dotenv/config';
import mongoose from 'mongoose';
import {seedData} from './seedData.js';

await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/alberto');
await seedData({adminEmail:process.env.ADMIN_EMAIL,adminPassword:process.env.ADMIN_PASSWORD});
console.log('Seeded nine watches and configured admin account');
await mongoose.disconnect();
