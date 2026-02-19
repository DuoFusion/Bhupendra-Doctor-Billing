import express from "express";
import { addBill, getAllBills, getBillById, deleteBill, updateBill } from "../controllers";
import { verifyToken } from "../middleware";

const router = express.Router();

router.get("/get/bills", verifyToken ,  getAllBills);
router.get("/get/bill/:id", verifyToken ,  getBillById);
router.post("/add/bill",  verifyToken , addBill);
router.put("/update/bill/:id",  verifyToken , updateBill);
router.delete("/delete/bill/:id", verifyToken ,  deleteBill);

export default router;
