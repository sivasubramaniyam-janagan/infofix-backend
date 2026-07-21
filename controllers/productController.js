import Product from "../modules/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res) {
    if (!isAdmin(req)){
        res.status(403).json({
            message:"unauthorized activity"
        })
        return
    }

    try{
        const existingProduct = await Product.findOne({
            productId:req.body.productId
        })
        
        if(existingProduct!=null){
            res.status(400).json({
                message:"Already exits"
            })
            return
        }else{
            const newProduct= new Product({
                productId:req.body.productId,
                name:req.body.name,
                altNames:req.body.altNames,
                price:req.body.price,
                labelledPrice:req.body.labelledPrice,
                description:req.body.description,
                category:req.body.category,
                images:req.body.images,
                brand:req.body.brand,
                model:req.body.model,
                stock:req.body.stock
            })

            await newProduct.save()
            res.status(201).json({
            message:"successfullt created"
        })
        }

        

    }
    catch(err){
        res.status(500).json({
            message:"Error creating product"
        })
    }
}

export async function getProducts(req,res) {

    try{

        if (isAdmin(req)){
            const products = await Product.find()
            res.json(products)
        }
        else{
            const products = await Product.find({
                isAvailable:true
            })
            res.json(products)
           
        }

    }
    catch(error){
        res.status(500).json({
            message:"error geting products"
        })
    }
    
}

export async function deleteProduct(req , res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message:"unauthorized access"
        })
        return
    }

    try{

        await Product.deleteOne({
            productId:req.params.productId
        })

        res.json({
            message:"deleted product sucessfully"
        })

    }catch(error){
        res.status(500).json({
            message:"error deleting product"
        })
    }

}

export async function updateProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message:"unauthorized access"
        })
        return
    }

    try{
        await Product.updateOne({
            productId:req.params.productId
        },{
           
                name:req.body.name,
                altNames:req.body.altNames,
                price:req.body.price,
                labelledPrice:req.body.labelledPrice,
                description:req.body.description,
                category:req.body.category,
                images:req.body.images,
                brand:req.body.brand,
                model:req.body.model,
                stock:req.body.stock
            
        })
        res.json({
            message:"updated successfully"
        })

    }
    catch(err){
        res.status(500).json({
            message:"Error updating product"
        })
    }
}

export async function getProductsById(req ,res){
    try{
        const product=await Product.findOne({
            productId : req.params.productId
        })

        if (product==null){
            res.status(404).json({
                message : "Product not found"
            })
            return
        }
        else{
            if (isAdmin(req)){
                res.json(product)
                return
            }
            else{
                if(product.isAvailable){
                    res.json(product)
                     return
                }
                else{
                     res.json({
                     message : "Product not available"
                     })
                      return
                }
            }
        }
    }
    catch(err){
        res.status(500).json("Error founding product")
    }
}


export async function searchProducts(req , res) {
    try{
        const rawQuery = req.params.query;

        if (!rawQuery || !rawQuery.trim()) {
            return res.status(400).json({ message: "query is required" });
        }

        const query = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const products = await Product.find({
            $or : [
                {name:{$regex:query , $options:"i"}},
                {description:{$regex:query , $options:"i"}},
                {altNames:{$elemMatch:{$regex:query,$options:"i"}}}
            ]
        })
        res.json(products)



    }catch(error){
        res.status(500).json({message:"error searching product"})
    }
}

