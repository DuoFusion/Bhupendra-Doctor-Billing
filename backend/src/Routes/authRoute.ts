import express from "express";
import { signIn, signout, signUp, verifyOTP } from "../controllers";
import { verifyToken } from "../middleware";

const router = express.Router();

router.post("/signup" , signUp);
router.post("/signin" , signIn);
router.post("/signout" , signout);
router.post("/otp/verify" , verifyOTP)


router.get("/me" , verifyToken , (req , res)=>{
    res.json({
        status : true,
        user : (req as any).user
    })
})

export default router;