import express from "express"
import { addNewProduct, deleteProduct, getAllProducts, getMyProducts, getProductById, updateProduct } from "../controllers"
import { verifyToken } from "../middleware"

const router = express.Router()

router.get("/get/products" ,  verifyToken , getAllProducts)
router.post("/addNew/product" , verifyToken ,  addNewProduct)
router.get("/get/my-products",  verifyToken , getMyProducts);
router.get("/getById/product/:id", verifyToken, getProductById);
router.put("/update/product/:id" , verifyToken ,  updateProduct)
router.delete("/delete/product/:id" , verifyToken ,  deleteProduct)

export default router