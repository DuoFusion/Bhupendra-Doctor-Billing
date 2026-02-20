import express from "express";
import { changePassword, resetForgotPassword, sendForgotPasswordOtp, signIn, signout, signUp, verifyForgotPasswordOtp, verifyOTP, updateProfile } from "../controllers";
import { verifyToken } from "../middleware";
import { Auth_Collection } from "../model";

const router = express.Router();

router.post("/signup" , signUp);
router.post("/signin" , signIn);
router.post("/signout" , signout);
router.post("/otp/verify" , verifyOTP)
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
router.put("/forgot-password/reset-password", resetForgotPassword);


router.get("/me" , verifyToken , async (req , res)=>{
    try {
        const tokenUser = (req as any).user;
        const dbUser = await Auth_Collection.findById(tokenUser?._id).select("-password");

        res.json({
            status : true,
            user : dbUser || tokenUser
        });
    } catch (error) {
        res.json({
            status : true,
            user : (req as any).user
        });
    }
})

router.put("/profile/update", verifyToken, updateProfile);
router.put("/password/change", verifyToken, changePassword);

export default router;
