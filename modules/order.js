import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    orderId:{               //ORD00000001
        required:true,
        unique:true,
        type:String
    },
    phone:{
        required:true,
        type:String
    },
    email :{
        required : true,
        type : String
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    addressLine1:{
        type:String,
        required:true
    },
    addressLine2:{
        type:String,

    },
    city:{
        type:String,
        required:true
    },
    province:{
        type:String,
        required:true
    },
    postalCode:{
        type:String,
        required:true
    },
    status :{
        type:String,
        default:"Pending"
    },
    notes:{
        type:String
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    total:{
        type:Number,
        default:0
    },
    items:[
        {
            product:{
                productId:{
                    required:true,
                    type:String
                },
                name:{
                    required:true,
                    type:String
                },
                labelledPrice:{
                    
                    type:Number
                },
                price:{
                    required:true,
                    type:Number  
                },
                image:{
                    type:String,
                    required:true
                }

            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ]
})

const order = mongoose.model("Order" , orderSchema)
export default order