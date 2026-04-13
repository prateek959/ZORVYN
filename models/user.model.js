import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, enum:["viewer", "analyst", "admin"],default: "viewer"},
    isActive:{type:Boolean, default:true},
},{timestamps:true});

const User = mongoose.model('user',userSchema);

export default User;