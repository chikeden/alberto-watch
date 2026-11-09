import mongoose from 'mongoose';
const schema=new mongoose.Schema({key:{type:String,unique:true,default:'total'},count:{type:Number,default:0}});
export default mongoose.model('Visitor',schema);
