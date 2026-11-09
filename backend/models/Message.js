import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,lowercase:true},message:{type:String,required:true,trim:true},status:{type:String,default:'new'}},{timestamps:true});
export default mongoose.model('Message',schema);
