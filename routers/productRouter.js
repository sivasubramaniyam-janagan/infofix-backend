import { createProduct,getProducts,deleteProduct, updateProduct, getProductsById, searchProducts } from "../controllers/productController.js";
import express from 'express'

const productRouter = express.Router()

productRouter.get("/",getProducts)
productRouter.post("/",createProduct)
productRouter.put("/:productId",updateProduct)
productRouter.delete("/:productId",deleteProduct)
productRouter.get("/:productId",getProductsById)
productRouter.get("/search/:query",searchProducts)

export default productRouter