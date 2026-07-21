import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export function authenticateUser(req,res,next){
        const head = req.headers.authorization
        if (head!=null){
            const token = head.replace("Bearer ","")
            
            jwt.verify(token,process.env.PAYLOAD,
                (error,decoded)=>{
                  if (decoded==null){
                        res.status(401).json({
                            message:"invalid token login again"
                         
                        })
                  }
                  else{
                    req.user=decoded
                    next()
                  }
                }
            )
        }
        else{
            next()
        }
    }