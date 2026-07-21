import order from "../modules/order.js"
import Product from "../modules/product.js"
export async function createOrder(req,res) {
    const user=req.user

    if(user == null){
        res.status(401).json({
            message:"you need to login 1st"
        })
        return
    }

   const orderData={
    orderId:"ORD00000001",
    email:user.email,
    firstname:user.firstname,
    lastname:user.lastname,
    addressLine1:req.body.addressLine1,
    addressLine2:req.body.addressLine2,
    city:req.body.city,
    province:req.body.province,
    postalCode:req.body.postalCode,
    phone:req.body.phone,
    total:0,
    items:[]
   }



   if(req.body.firstname!=null && req.body.firstname!=""){
    orderData.firstname=req.body.firstname
   }
   
   if(req.body.lastname!=null && req.body.lastname!=""){
    orderData.lastname=req.body.lastname
   }

    try{

        const lastOrder = await order.findOne().sort({date:-1})//returns the last order

        if(lastOrder != null){
            const lastOrderIdNumber=lastOrder.orderId.replace("ORD","")
            const lastorderNumber=parseInt(lastOrderIdNumber)
            const newordernumber=(lastorderNumber+1).toString()
            const newodernumberinstring=newordernumber.padStart(8,"0")
            orderData.orderId="ORD"+newodernumberinstring
            
        }


        for (let i=0; i<req.body.items.length;i++){
            const product= await Product.findOne({productId:req.body.items[i].productId})
            if(product==null || !product.isAvailable  ){
                res.status(401).json({message:"error in finding product"})
                return
            }
            else{
                orderData.items.push({
                    product:{
                        productId:product.productId,
                        name:product.name,
                        price:product.price,
                        labelledPrice:product.labelledPrice,
                        image:product.images[0]
                    },
                    quantity:req.body.items[i].quantity
                })

                orderData.total+=product.price*req.body.items[i].quantity

            }
        }

        const newOrder = new order(orderData)
        await newOrder.save()

        res.status(201).json({
            message:"order placed successfully"
        })


    }catch(err){
        console.error(err)
        return res.status(500).json({message:"internal server error"})
    }
}

export async function getOrders(req,res){
    try{

        const pageSize=parseInt(req.params.pageSize)
        const pageNummber=parseInt(req.params.pageNumber)

        if(req.user==null){
            return res.status(401).json({message:"Login needed"})   
        }

        if(req.user.isAdmin){
            const orderCount=await order.countDocuments()
            const totalPages=Math.ceil(orderCount/pageSize)
            const orders=await order.find().sort({date:-1}).skip((pageNummber-1)*pageSize).limit(pageSize)
            return res.status(200).json({orders,totalPages,orderCount})
        }
        else{
            const orderCount=await order.countDocuments({email:req.user.email})
            const totalPages=Math.ceil(orderCount/pageSize)
            const orders=await order.find({email:req.user.email}).sort({date:-1}).skip((pageNummber-1)*pageSize).limit(pageSize)
            return res.status(200).json({orders,totalPages,orderCount})
        }
    }
    catch(err){
         return res.status(500).json({message:"Something went wrong"})
    }

}

export async function updateOrderStatusAndNotes(req,res) {

    if(req.user && req.user.isAdmin){
        try{
            const orderId=req.params.orderId

            await order.findOneAndUpdate({orderId},{notes:req.body.notes,status:req.body.status})
            res.status(200).json({message:"updated successfuly"})

        }catch(err){
            res.status(500).json({message:"somthing went wrong"})
        }
    }
    else{
        res.status(401).json({message:"unauthorized acitivity"})
    }
    
}