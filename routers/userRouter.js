import { changePassword, createUser, getUserData, googleLogin, loginUser, sendOTP, updateUser, verifyOTPandResetPassword }  from "../controllers/userController.js";
import express  from "express"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/me",getUserData)
userRouter.put("/",updateUser)
userRouter.put("/password", changePassword)
userRouter.post("/google-login",googleLogin)
userRouter.post("/send-otp",sendOTP)
userRouter.post("/verify-otp",verifyOTPandResetPassword)
export default userRouter
