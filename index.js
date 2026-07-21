import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import express from "express";
import cors from "cors"
import jwt from "jsonwebtoken"
import {authenticateUser} from "./middlewares/authentication.js";
import productRouter from "./routers/productRouter.js";
const app = express()
import dotenv from "dotenv";
import orderRouter from "./routers/orderRouter.js";


dotenv.config()
const DBuri = process.env.MONGO_URI

mongoose.connect(DBuri).then(
    ()=>{console.log("database connected")}
).catch((err)=>{
    console.log(err)
    console.log("not connected")
})
app.use(cors())
app.use(express.json())

app.use(authenticateUser)

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/order",orderRouter)

app.listen(3000,()=>{
    console.log("conected")
})
