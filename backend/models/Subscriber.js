import mongoose from 'mongoose';
const schema=new mongoose.Schema({email:{type:String,required:true,unique:true,lowercase:true}},{timestamps:true});
export default mongoose.model('Subscriber',schema);
