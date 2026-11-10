import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import {put as putBlob,del as deleteBlob} from '@vercel/blob';
import {rateLimit} from 'express-rate-limit';
import Product from './models/Product.js';
import User from './models/User.js';
import Visitor from './models/Visitor.js';
import Message from './models/Message.js';
import Subscriber from './models/Subscriber.js';
import {seedData,ensureInitialAdmin} from './scripts/seedData.js';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';

const app=express();
app.disable('x-powered-by');
let connectionPromise;
async function connectDatabase(){
  if(mongoose.connection.readyState===1)return;
  if(!process.env.MONGO_URI&&!process.env.MONGODB_URI)throw new Error('MongoDB connection is not configured');
  connectionPromise ||= mongoose.connect(process.env.MONGO_URI||process.env.MONGODB_URI)
    .then(async()=>{
      if(process.env.VERCEL){
        if(await Product.estimatedDocumentCount()===0)await seedData();
        if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD)await ensureInitialAdmin(process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD);
      }
    })
    .catch(error=>{connectionPromise=undefined;throw error});
  await connectionPromise;
}
if(process.env.VERCEL){
  app.use('/api',async(req,res,next)=>{
    try{
      if(!process.env.JWT_SECRET)throw new Error('JWT_SECRET is not configured');
      await connectDatabase();
      next();
    }catch(error){console.error('API configuration or database connection failed:',error.message);res.status(503).json({error:{code:'SERVICE_UNAVAILABLE',message:'The API is temporarily unavailable'}})}
  });
}
app.use(cors({origin:process.env.FRONTEND_ORIGIN||'http://localhost:5173',credentials:true}));
app.use(express.json({limit:'1mb'}));
app.use(cookieParser());
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:40,standardHeaders:'draft-7',legacyHeaders:false}));
const fail=(res,status,code,message)=>res.status(status).json({error:{code,message}});
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const publicUser=user=>({_id:user._id,name:user.name,email:user.email,role:user.role});
const cookieOptions={httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:7*24*60*60*1000,path:'/'};
const sign=(res,user)=>res.cookie('alberto_session',jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'}),cookieOptions);
const auth=wrap(async(req,res,next)=>{const token=req.cookies.alberto_session;if(!token)return fail(res,401,'UNAUTHORIZED','Sign in required');try{const payload=jwt.verify(token,process.env.JWT_SECRET);req.user=await User.findById(payload.id);if(!req.user)return fail(res,401,'UNAUTHORIZED','Session expired');next()}catch{return fail(res,401,'UNAUTHORIZED','Session expired')}});
const admin=(req,res,next)=>req.user.role==='admin'?next():fail(res,403,'FORBIDDEN','Admin access required');
app.get('/api/health',(_,res)=>res.json({ok:true,database:mongoose.connection.readyState===1?'connected':'disconnected'}));
app.post('/api/auth/register',wrap(async(req,res)=>{const {name,email,password}=req.body;if(!name?.trim()||!/^\S+@\S+\.\S+$/.test(email||'')||typeof password!=='string'||password.length<10)return fail(res,400,'VALIDATION','Valid name, email and password of at least 10 characters required');if(await User.exists({email:email.toLowerCase()}))return fail(res,409,'CONFLICT','Email already registered');const user=await User.create({name:name.trim(),email:email.toLowerCase(),passwordHash:await bcrypt.hash(password,12)});sign(res,user);res.status(201).json({user:publicUser(user)})}));
app.post('/api/auth/login',wrap(async(req,res)=>{const user=await User.findOne({email:String(req.body.email||'').toLowerCase()}).select('+passwordHash');if(!user||!await bcrypt.compare(String(req.body.password||''),user.passwordHash))return fail(res,401,'INVALID_CREDENTIALS','Email or password is incorrect');sign(res,user);res.json({user:publicUser(user)})}));
app.post('/api/auth/logout',(_,res)=>{const {maxAge,...clearOptions}=cookieOptions;res.clearCookie('alberto_session',clearOptions);res.json({ok:true})});
app.get('/api/auth/me',auth,(req,res)=>res.json({user:publicUser(req.user)}));
app.get('/api/products',wrap(async(req,res)=>{const page=Math.max(1,Number.parseInt(req.query.page,10)||1);const filter={};if(req.query.category&&['luxury','vintage','smart'].includes(req.query.category))filter.category=req.query.category;if(req.query.q)filter.name={$regex:String(req.query.q).slice(0,80).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'};const [items,total]=await Promise.all([Product.find(filter).sort({featured:-1,createdAt:-1}).skip((page-1)*24).limit(24).lean(),Product.countDocuments(filter)]);res.json({items,total,page})}));
app.get('/api/products/:slug',wrap(async(req,res)=>{const item=await Product.findOne({slug:req.params.slug}).lean();item?res.json(item):fail(res,404,'NOT_FOUND','Watch not found')}));
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
const localUploadDir=path.join(path.dirname(fileURLToPath(import.meta.url)),'uploads');
app.use('/api/uploads',express.static(localUploadDir,{index:false,immutable:true,maxAge:'1y'}));
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024,files:4},fileFilter:(_,file,cb)=>cb(['image/jpeg','image/png','image/webp'].includes(file.mimetype)?null:new Error('Unsupported image type'),true)});
const uploadAsset=async file=>{
  if(process.env.USE_IN_MEMORY_DB==='true'&&!process.env.CLOUDINARY_CLOUD_NAME){
    await mkdir(localUploadDir,{recursive:true});
    const name=`${randomUUID()}.${file.mimetype==='image/png'?'png':file.mimetype==='image/webp'?'webp':'jpg'}`;
    await writeFile(path.join(localUploadDir,name),file.buffer);
    return {secure_url:`/api/uploads/${name}`,public_id:`local:${name}`};
  }
  if(!process.env.CLOUDINARY_CLOUD_NAME){
    if(!process.env.BLOB_READ_WRITE_TOKEN)throw new Error('Image storage is not configured');
    const extension=file.mimetype==='image/png'?'png':file.mimetype==='image/webp'?'webp':'jpg';
    const blob=await putBlob(`watches/${randomUUID()}.${extension}`,file.buffer,{access:'public',contentType:file.mimetype});
    return {secure_url:blob.url,public_id:`blob:${blob.url}`};
  }
  return new Promise((resolve,reject)=>{const stream=cloudinary.uploader.upload_stream({folder:'alberto-watches',resource_type:'image'},(error,result)=>error?reject(error):resolve(result));stream.end(file.buffer)});
};
const removeAsset=async publicId=>{if(publicId.startsWith('local:'))return unlink(path.join(localUploadDir,publicId.slice(6))).catch(()=>{});if(publicId.startsWith('blob:'))return deleteBlob(publicId.slice(5));return cloudinary.uploader.destroy(publicId)};
const bodyProduct=req=>req.body.product?JSON.parse(req.body.product):req.body;
const parseProduct=req=>{const raw=bodyProduct(req);const allowed=['name','slug','category','price','currency','description','specs','featured','stock'];return Object.fromEntries(allowed.filter(k=>raw[k]!==undefined).map(k=>[k,raw[k]]))};
const validateProduct=p=>typeof p.name==='string'&&p.name.trim().length>1&&/^[a-z0-9-]+$/.test(p.slug||'')&&['luxury','vintage','smart'].includes(p.category)&&p.price!==''&&Number.isFinite(Number(p.price))&&Number(p.price)>=0&&typeof p.description==='string'&&p.description.trim().length>3;
app.post('/api/products',auth,admin,upload.array('images',4),wrap(async(req,res)=>{const data=parseProduct(req);if(!validateProduct(data))return fail(res,400,'VALIDATION','Name, slug, category, price and description required');const images=[];try{for(const file of req.files||[]){const result=await uploadAsset(file);images.push({url:result.secure_url,publicId:result.public_id,alt:`${data.name} watch`})}const item=await Product.create({...data,images});res.status(201).json(item)}catch(error){await Promise.all(images.map(i=>removeAsset(i.publicId)));throw error}}));
app.put('/api/products/:id',auth,admin,upload.array('images',4),wrap(async(req,res)=>{const existing=await Product.findById(req.params.id);if(!existing)return fail(res,404,'NOT_FOUND','Watch not found');const raw=bodyProduct(req),data=parseProduct(req);if(!validateProduct({...existing.toObject(),...data}))return fail(res,400,'VALIDATION','Invalid product details');const removed=Array.isArray(raw.removeImageIds)?existing.images.filter(i=>raw.removeImageIds.includes(i.publicId)):[];const images=[];try{for(const file of req.files||[]){const result=await uploadAsset(file);images.push({url:result.secure_url,publicId:result.public_id,alt:`${data.name||existing.name} watch`})}const kept=existing.images.filter(i=>!removed.some(r=>r.publicId===i.publicId));const item=await Product.findByIdAndUpdate(req.params.id,{$set:{...data,images:[...kept,...images]}},{new:true,runValidators:true});await Promise.all(removed.filter(i=>i.publicId).map(i=>removeAsset(i.publicId)));res.json(item)}catch(error){await Promise.all(images.map(i=>removeAsset(i.publicId)));throw error}}));
app.delete('/api/products/:id',auth,admin,wrap(async(req,res)=>{const item=await Product.findByIdAndDelete(req.params.id);if(!item)return fail(res,404,'NOT_FOUND','Watch not found');await Promise.all(item.images.filter(i=>i.publicId).map(i=>removeAsset(i.publicId)));res.json({ok:true})}));
app.get('/api/visitors',wrap(async(_,res)=>res.json({count:(await Visitor.findOne({key:'total'}))?.count||0})));
app.post('/api/visitors',wrap(async(req,res)=>{if(req.cookies.alberto_visited)return res.json({count:(await Visitor.findOne({key:'total'}))?.count||0});const visitor=await Visitor.findOneAndUpdate({key:'total'},{$inc:{count:1}},{upsert:true,new:true});res.cookie('alberto_visited','1',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'});res.json({count:visitor.count})}));
app.get('/api/admin/stats',auth,admin,wrap(async(req,res)=>{const [products,subscribers,messages,visitors]=await Promise.all([Product.countDocuments(),Subscriber.countDocuments(),Message.countDocuments(),Visitor.findOne({key:'total'})]);res.json({products,subscribers,messages,visitors:visitors?.count||0})}));
app.get('/api/admin/messages',auth,admin,wrap(async(req,res)=>{const items=await Message.find().sort({createdAt:-1}).limit(100).lean();res.json({items})}));
app.post('/api/contact',rateLimit({windowMs:60*60*1000,limit:5}),wrap(async(req,res)=>{const {name,email,message}=req.body;if(typeof name!=='string'||name.trim().length<2||name.length>100||!/^\S+@\S+\.\S+$/.test(email||'')||typeof message!=='string'||message.trim().length<10||message.length>4000)return fail(res,400,'VALIDATION','Enter a name, valid email, and message of at least 10 characters');await Message.create({name:name.trim(),email:email.toLowerCase(),message:message.trim()});res.status(201).json({ok:true})}));
app.post('/api/newsletter',rateLimit({windowMs:60*60*1000,limit:10}),wrap(async(req,res)=>{const email=String(req.body.email||'').trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(email))return fail(res,400,'VALIDATION','Enter a valid email address');await Subscriber.updateOne({email},{$setOnInsert:{email}},{upsert:true});res.status(201).json({ok:true})}));
app.use((error,req,res,next)=>{if(error?.code==='LIMIT_FILE_SIZE')return fail(res,413,'FILE_TOO_LARGE','Image must be under 8 MB');if(error?.name==='ValidationError'||error?.name==='CastError'||error instanceof SyntaxError)return fail(res,400,'VALIDATION',error.message);if(error?.code===11000)return fail(res,409,'CONFLICT','A record with this value already exists');console.error(error);fail(res,500,'SERVER_ERROR','Something went wrong')});
export async function startServer(){
  if(!process.env.JWT_SECRET)throw new Error('JWT_SECRET is required');
  let memoryServer;
  let uri=process.env.MONGO_URI||'mongodb://127.0.0.1:27017/alberto';
  if(process.env.USE_IN_MEMORY_DB==='true'){
    const {MongoMemoryServer}=await import('mongodb-memory-server');
    memoryServer=await MongoMemoryServer.create();
    uri=memoryServer.getUri();
  }
  if(process.env.USE_IN_MEMORY_DB==='true')await mongoose.connect(uri);
  else await connectDatabase();
  if(memoryServer)await seedData({adminEmail:process.env.ADMIN_EMAIL,adminPassword:process.env.ADMIN_PASSWORD});
  const port=Number(process.env.PORT)||4000;
  const server=app.listen(port,()=>console.log(`Alberto API listening on ${port}`));
  return {server,memoryServer};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  startServer().catch(error=>{console.error('Server startup failed',error);process.exitCode=1});
}
export {app};
export default app;
