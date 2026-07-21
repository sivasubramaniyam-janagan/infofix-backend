import User from '../modules/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import { response } from 'express'
import axios from 'axios'
import OTP from '../modules/otp.js'
import nodemailer from "nodemailer"


dotenv.config()
const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.GMAIL,
        pass:process.env.GMAIL_APP_PASSWORD
    }
})


export async function createUser(req,res) {

    try{
        const user= await User.findOne({email:req.body.email})

        if(user){
            return res.status(409).json({message:"An account with this email already exists"})
        }

        const passwordHash=bcrypt.hashSync(req.body.password,10)
        const newUser=new User({
            email : req.body.email,
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            password : passwordHash
        })

        await newUser.save()

        res.status(201).json({
            message : "user created succesfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message:"error creating user",
           
        })
    }
}

export async function googleLogin(req,res) {

    const token = req.body.token
    
    try{
        const response =  await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{headers:{
            Authorization:"Bearer "+token
        }})
        
       
        const user = await User.findOne({email:response.data.email})
        if(user==null){
            const newUser =new  User({
                email:response.data.email,
                isAdmin:false,
                isEmailVerified:true,
                firstname:response.data.given_name,
                lastname:response.data.family_name,
                image:response.data.picture,
                password:"google-signin"

            })

            await newUser.save()

            const newtoken=jwt.sign({
                email:response.data.email,
                firstname:response.data.given_name,
                lastname:response.data.family_name,
                isAdmin:false,
                isBlocked:false,
                isEmailVerified:true,
                image:response.data.picture},process.env.PAYLOAD,{expiresIn: "3600s"})

            return res.json({
                token:newtoken,
                isAdmin:false
            })
        }else{

            const payload={
            email:user.email,
            firstname:user.firstname,
            lastname:user.lastname,
            isAdmin:user.isAdmin,
            isBlocked:user.isBlocked,
            isEmailVerified:user.isEmailVerified,
            image:user.image
             }

            const newtoken = jwt.sign(payload, process.env.PAYLOAD, {
                 expiresIn: "3600s"
                });


            return res.json({
                token:newtoken,
                isAdmin:user.isAdmin,
            })
        }


    }
    catch(err){
        return res.status(400).json({message:"google sign in failes"})
    }
    
}



export async function loginUser(req, res) {
    let user
    try {
         user = await User.findOne({
            email:req.body.email
        })
    }
    catch(err){
       return res.status(500).json({
            message:"something went wrong"
        })
    }

    if (user==null){
        return res.status(404).json({
            message:"user not found"

        })
    }
    else{
        const isValid=bcrypt.compareSync(req.body.password,user.password)
        if (isValid){
            
        const payload={
            email:user.email,
            firstname:user.firstname,
            lastname:user.lastname,
            isAdmin:user.isAdmin,
            isBlocked:user.isBlocked,
            isEmailVerified:user.isEmailVerified,
            image:user.image
        }


        const token = jwt.sign(payload, process.env.PAYLOAD, {
                 expiresIn: "3600s"
                });
        console.log(token)
    
        res.json({
            message:"login succesfull",
            newtoken:token,
            isAdmin:user.isAdmin
                     })

        }
        else{
            res.status(401).json({
            message:"email or passowrd wrong"
        })
        }
        
    }
}

export function isAdmin(req){
    if(req.user==null){
        return false
    }
    if (req.user.isAdmin){
        return true
    }
    else{
        return false
    }
}

export function getUserData(req,res){
    if(req.user==null){
        res.status(401).json({message:"UnAuthorized"})
    }
    else{
        res.json(req.user)
    }
}

export async function updateUser(req,res) {

    if(req.user==null){
        return res.status(401).json({message:"unauthorized"})
    }
    else{
        try{
            await User.findOneAndUpdate({email:req.user.email},{
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                image:req.body.image
            })

            const updatedUser= await User.findOne({email:req.user.email})
            
            const payload={
            email:updatedUser.email,
            firstname:updatedUser.firstname,
            lastname:updatedUser.lastname,
            isAdmin:updatedUser.isAdmin,
            isBlocked:updatedUser.isBlocked,
            isEmailVerified:updatedUser.isEmailVerified,
            image:updatedUser.image
        }

            const token = jwt.sign(payload, process.env.PAYLOAD, {
                expiresIn: "3600s"
                });
            console.log(token)

            return res.status(200).json({token,message:"updated successfuly"})


        }catch(err){
            return res.status(500).json({message:"error updating user"})
        }
    }
    
}


export async function changePassword(req,res) {
    if(req.user==null){
        return res.status(401).json({message:"unauthorized"})
    }

    if (!req.body.newPassword || req.body.newPassword.length < 8) {
    return res.status(400).json({message:"new password must be at least 8 characters"})
}

    try{
        const oldPassword = await User.findOne({email:req.user.email})
        const isValid= await bcrypt.compare(req.body.password,oldPassword.password)
        if(!isValid){
            return res.status(401).json({message:"wrong password"})
        }
        const hashedPassword = bcrypt.hashSync(req.body.newPassword,10)
        await User.findOneAndUpdate({email:req.user.email},{password:hashedPassword})
        res.status(200).json({message:"updated successfuly"})
    }catch(err){
        return res.status(500).json({message:"error changing password"})
        console.log(err)
    }
}

export async function sendOTP(req,res) {
    const email=req.body.email
    try{
        const user = await User.findOne({email:email})
            
        if(user==null){
            return res.status(404).json({message:"User not found"})
        }

        await OTP.findOneAndDelete({email:email})

        const otpCode=Math.floor(100000+Math.random()*900000).toString()
        const newOtp=new OTP({
            email:email,
            otp:otpCode
        })
        
        await newOtp.save()

        const message = {
            from: process.env.GMAIL,
            to: email,
            subject: "Password Reset OTP",
            html: `
                <div style="max-width:480px;margin:0 auto;font-family:Arial, sans-serif;background-color:#f4f4f7;padding:32px;border-radius:8px;">
                    <h2 style="color:#1a1a2e;text-align:center;margin-bottom:8px;">Password Reset Request</h2>
                    <p style="color:#555;text-align:center;font-size:14px;margin-bottom:24px;">
                        Use the code below to reset your password.
                    </p>
                    <div style="background-color:#ffffff;border:1px dashed #4f46e5;border-radius:6px;padding:16px;text-align:center;margin-bottom:24px;">
                        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#4f46e5;">${otpCode}</span>
                    </div>
                    <p style="color:#999;text-align:center;font-size:12px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>`
            }

        transporter.sendMail(message,(error,info)=>{
            if(error){
                console.log(error)
                return res.status(500).json({message:"Error sending email"})
            }
            else{
                return res.json({message:"email sent successfuly"})
            }
        })



    }catch(err){
        return res.status(500).json({message:"Error sending OTP"})
    }
}

export async function verifyOTPandResetPassword(req,res) {
    const email = req.body.email
    const otp = req.body.otp
    const newpassword = req.body.password

    try{
        const recordOTP=await OTP.findOne({email:email})
        if(recordOTP==null){
            return res.status(400).json({message:"Invalid OTP"})
        }
        if(otp!=recordOTP.otp){
            return res.status(400).json({message:"Invalid OTP"})
        }

        const otpAgeMs = Date.now() - recordOTP.createdTime.getTime()
        const otpAgeMinutes = otpAgeMs / (1000 * 60)

        if(otpAgeMinutes>5){
            return res.status(400).json({message:"OTP expired"})
        }

       const passwordHash=bcrypt.hashSync(newpassword,10)
       await User.findOneAndUpdate({email:email},{password:passwordHash})
       await OTP.deleteOne({email:email})
        res.json({message:"password reset successfuly"})



    }catch(error){
        return res.status(500).json({message:"somthing went wrong"})
    }
}