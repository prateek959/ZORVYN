import mongoose from "mongoose";

const financialSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    amount:{type:Number, required:true},
    type:{type:String, enum:["income", "expense"], required:true},
    category:{type:String},
    note:{type:String},
    date:{type:Date,  default:Date.now},
},{timestamps:true});

const Finance = mongoose.model('Financial',financialSchema);

export default Finance;