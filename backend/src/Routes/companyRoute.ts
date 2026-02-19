import express from "express"
import { addNewCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers"
import upload from "../helper/uploadFiles";
import { verifyToken } from "../middleware";

const router = express.Router()

router.get("/get/company" , verifyToken,   getAllCompanies);
router.post("/addNew/company" , verifyToken , upload.single("logoImage"), addNewCompany)
router.get("/getById/company/:id", verifyToken, getCompanyById);
router.put("/update/company/:id" , verifyToken ,upload.single("logoImage"), updateCompany)
router.delete("/delete/company/:id" , verifyToken , deleteCompany)

export default router