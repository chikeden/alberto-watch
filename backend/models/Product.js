import mongoose from 'mongoose';
const spec=new mongoose.Schema({caseDiameterMm:Number,thicknessMm:Number,lugWidthMm:Number,caseMaterial:String,movement:String,powerReserveH:Number,waterResistanceM:Number,crystal:String,strap:String},{_id:false});
const image=new mongoose.Schema({url:{type:String,required:true},publicId:String,alt:{type:String,required:true}},{_id:false});
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},slug:{type:String,required:true,unique:true,lowercase:true},category:{type:String,enum:['luxury','vintage','smart'],required:true},price:{type:Number,required:true,min:0},currency:{type:String,default:'USD'},description:{type:String,required:true},specs:spec,images:[image],featured:{type:Boolean,default:false},stock:{type:Number,default:0,min:0}},{timestamps:true});
export default mongoose.model('Product',schema);
