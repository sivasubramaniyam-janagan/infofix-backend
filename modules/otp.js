import mongoose from "mongoose";

const otp=new mongoose.Schema({
    email:{
        unique:true,
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdTime:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export default mongoose.model("OTP",otp)