import { Router } from "express";
import { addNewCompany } from "../controllers";
import upload from "../helper/uploadFiles";

const router = Router();

router.post("/",upload.single("logoImage"), addNewCompany);

export default router;
