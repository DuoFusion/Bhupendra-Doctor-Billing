import express from "express";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category";
import { verifyToken } from "../middleware";

const router = express.Router();

router.get("/get/categories", verifyToken, getCategories);
router.post("/add/category", verifyToken, addCategory);
router.put("/update/category", verifyToken, updateCategory);
router.delete("/delete/category", verifyToken, deleteCategory);

export default router;
