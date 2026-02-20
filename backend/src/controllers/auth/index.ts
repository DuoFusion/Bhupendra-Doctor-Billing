import { Auth_Collection, OTP_Collection } from "../../model";
import bcrypt from "bcryptjs";
import { responseMessage, status_code } from "../../common";
import { otpSender } from "../../helper";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import nodemailer from "nodemailer";
import {
    changePasswordValidation,
    forgotPasswordResetValidation,
    forgotPasswordSendOtpValidation,
    forgotPasswordVerifyOtpValidation,
    signInValidation,
    signUpValidation,
    updateProfileValidation
} from "../../validation";
dotenv.config()

const forgotPasswordTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

//================ signUp controller =======================
export const signUp = async (req , res)=>{

    const {error} = signUpValidation.validate(req.body)

    if (error) {
        return res.status(400).json({
        status: false,
        message: error.details[0].message,
        });
    }

    try {
        const {name , email , role , password} = req.body
        const hashedPassword = bcrypt.hashSync(password , 12)

        const userExist = await Auth_Collection.findOne({email});
        if(userExist){
            return res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.user_alreadyExist , userExist})
        }

        const result = await Auth_Collection.create({name , email , role , password : hashedPassword});
        
        res.status(status_code.SUCCESS).json({status : true , message : responseMessage.signUp_successfull})
    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.signUp_failed})
    }
}


    //================ signIn controller =======================
    export const signIn = async (req ,res)=>{
        const {error} = signInValidation.validate(req.body)

        if (error) {
            return res.status(400).json({
            status: false,
            message: error.details[0].message,
            });
        }


        try {
            const {email , password } = req.body
            const user = await Auth_Collection.findOne({email})

            if(!user){
                return res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.userNotFound })
            }

            const isMatched = bcrypt.compareSync(password , user.password);
            if(!isMatched){
                return res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.incorrectPassword })
            }

            const isOtpSent = await otpSender(email)
        
            res.status(status_code.SUCCESS).json({status : true , message : responseMessage.signIn_successful , isOtpSent})

        } catch (error) {
            res.status(status_code.INTERNAL_SERVER_ERROR).json({status : false , message : responseMessage.signIn_failed , error})
        }
    }

        /*================= Signout Controller ==============*/
        export const signout = async (req, res) => {
        try {

            res.clearCookie("Auth_Token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            });

            return res.status(status_code.SUCCESS).json({
            status: true,
            message: responseMessage.signOut_SuccessFull
            });

        } catch (error) {
            return res.status(500).json({
            status: false,
            message: responseMessage.signOut_failed
            });
        }
        };



    /*============ OTP Verifing controller ===========*/
    export const verifyOTP = async (req ,res)=>{
        try {
                const {email , otp} = req.body;
                const record = await OTP_Collection.findOne({email , otp, purpose: "signin"});

                if(!record){
                    return res.status(status_code.BAD_REQUEST).json({status : false , message : "OTP is incorrect !" });
                }

                if(record.expireAt < new Date(Date.now())){
                    return res.status(status_code.BAD_REQUEST).json({status : false , message : "OTP is expired !"});
                }

                await OTP_Collection.deleteMany({email, purpose: "signin"} as any);

                const user = await Auth_Collection.findOne({email});
                const token = jwt.sign({user : {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    phone: user.phone || "",
                    address: user.address || "",
                    city: user.city || "",
                    state: user.state || "",
                    pincode: user.pincode || ""
                }} , process.env.SECRET_KEY , {expiresIn : "1d"});
                
                res.cookie("Auth_Token" , token , {
                    maxAge :  1000 * 60 * 60 * 24,
                    sameSite: "lax",  
                    secure: false,
                    httpOnly : true,
                })
                
                res.json({status : true , message : responseMessage.otp_verifyAndSignin , user});
                
        } catch (error) {
            res.status(400).json({status : false , message : responseMessage.otp_invalid , error : error.message})
        }
    }

    /*============ Update Profile controller ===========*/
    export const updateProfile = async (req , res) => {
        const {error} = updateProfileValidation.validate(req.body)

        if (error) {
            return res.status(400).json({
            status: false,
            message: error.details[0].message,
            });
        }

        try {
            const userId = (req as any).user._id;
            const { name, email, phone, address, city, state, pincode } = req.body;
            
            // Build update object - only include provided fields
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;
            if (phone !== undefined) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;
            if (city !== undefined) updateData.city = city;
            if (state !== undefined) updateData.state = state;
            if (pincode !== undefined) updateData.pincode = pincode;

            // Check if email is being changed and if it already exists
            if (email && email !== (req as any).user.email) {
                const emailExists = await Auth_Collection.findOne({ email, _id: { $ne: userId } });
                if (emailExists) {
                    return res.status(status_code.BAD_REQUEST).json({
                        status: false,
                        message: "Email already in use by another account"
                    });
                }
            }

            const updatedUser = await Auth_Collection.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            if (!updatedUser) {
                return res.status(status_code.NOT_FOUND).json({
                    status: false,
                    message: "User not found"
                });
            }

            // Update JWT token with new user info
            const newToken = jwt.sign({user : {
                _id : updatedUser._id,
                name : updatedUser.name,
                email : updatedUser.email,
                role : updatedUser.role,
                phone: updatedUser.phone || "",
                address: updatedUser.address || "",
                city: updatedUser.city || "",
                state: updatedUser.state || "",
                pincode: updatedUser.pincode || ""
            }} , process.env.SECRET_KEY , {expiresIn : "1d"});
            
            res.cookie("Auth_Token" , newToken , {
                maxAge :  1000 * 60 * 60 * 24,
                sameSite: "lax",  
                secure: false,
                httpOnly : true,
            })

            res.status(status_code.SUCCESS).json({
                status: true,
                message: "Profile updated successfully",
                user: updatedUser
            });

        } catch (error) {
            res.status(status_code.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Failed to update profile",
                error: error.message
            });
        }
    }

    /*============ Forgot Password: Send OTP ===========*/
    export const sendForgotPasswordOtp = async (req, res) => {
        const { error } = forgotPasswordSendOtpValidation.validate(req.body);

        if (error) {
            return res.status(status_code.BAD_REQUEST).json({
                status: false,
                message: error.details[0].message,
            });
        }

        try {
            const { email } = req.body;
            const user = await Auth_Collection.findOne({ email });

            if (!user) {
                return res.status(status_code.NOT_FOUND).json({
                    status: false,
                    message: responseMessage.userNotFound,
                });
            }

            const otp = generateOtpCode();
            const otpHash = bcrypt.hashSync(otp, 10);
            const expireAt = new Date(Date.now() + 1000 * 60 * 3);

            await OTP_Collection.deleteMany({ email, purpose: "reset" } as any);
            await OTP_Collection.create({
                email,
                otp: otpHash,
                expireAt,
                purpose: "reset",
            } as any);

            await forgotPasswordTransporter.sendMail({
                from: `Security Team <${process.env.EMAIL}>`,
                to: email,
                subject: "Password Reset OTP",
                text: `Hello,\n\nYour password reset OTP is: ${otp}\nThis OTP is valid for 3 minutes.\n\nIf you did not request this, please ignore this email.\n\n- Security Team`,
            });

            return res.status(status_code.SUCCESS).json({
                status: true,
                message: responseMessage.forgotPassword_otp_sent,
            });
        } catch (error) {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: responseMessage.forgotPassword_otp_verify_failed,
                error: error.message,
            });
        }
    };

    /*============ Forgot Password: Verify OTP ===========*/
    export const verifyForgotPasswordOtp = async (req, res) => {
        const { error } = forgotPasswordVerifyOtpValidation.validate(req.body);

        if (error) {
            return res.status(status_code.BAD_REQUEST).json({
                status: false,
                message: error.details[0].message,
            });
        }

        try {
            const { email, otp } = req.body;
            const record = await OTP_Collection.findOne({ email, purpose: "reset" } as any).sort({ createdAt: -1 });

            if (!record) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.forgotPassword_otp_invalid,
                });
            }

            if (record.expireAt < new Date()) {
                await OTP_Collection.deleteMany({ email, purpose: "reset" } as any);
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.forgotPassword_otp_expired,
                });
            }

            const isMatched = bcrypt.compareSync(otp, record.otp);
            if (!isMatched) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.forgotPassword_otp_invalid,
                });
            }

            return res.status(status_code.SUCCESS).json({
                status: true,
                message: responseMessage.forgotPassword_otp_verified,
            });
        } catch (error) {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: responseMessage.forgotPassword_otp_send_failed,
                error: error.message,
            });
        }
    };

    /*============ Forgot Password: Reset Password ===========*/
    export const resetForgotPassword = async (req, res) => {
        const { error } = forgotPasswordResetValidation.validate(req.body);

        if (error) {
            return res.status(status_code.BAD_REQUEST).json({
                status: false,
                message: error.details[0].message,
            });
        }

        try {
            const { email, otp, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.password_confirm_mismatch,
                });
            }

            const user = await Auth_Collection.findOne({ email });
            if (!user) {
                return res.status(status_code.NOT_FOUND).json({
                    status: false,
                    message: responseMessage.userNotFound,
                });
            }

            const record = await OTP_Collection.findOne({ email, purpose: "reset" } as any).sort({ createdAt: -1 });

            if (!record) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.forgotPassword_otp_invalid,
                });
            }

            if (record.expireAt < new Date()) {
                await OTP_Collection.deleteMany({ email, purpose: "reset" } as any);
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.forgotPassword_otp_expired,
                });
            }

            const isOtpMatched = bcrypt.compareSync(otp, record.otp);
            if (!isOtpMatched) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.forgotPassword_otp_invalid,
                });
            }

            user.password = bcrypt.hashSync(newPassword, 12);
            await user.save();
            await OTP_Collection.deleteMany({ email, purpose: "reset" } as any);

            return res.status(status_code.SUCCESS).json({
                status: true,
                message: responseMessage.forgotPassword_reset_success,
            });
        } catch (error) {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: responseMessage.forgotPassword_reset_failed,
                error: error.message,
            });
        }
    };

    /*============ Change Password controller ===========*/
    export const changePassword = async (req, res) => {
        const { error } = changePasswordValidation.validate(req.body);

        if (error) {
            return res.status(status_code.BAD_REQUEST).json({
                status: false,
                message: error.details[0].message,
            });
        }

        try {
            const userId = (req as any).user?._id;
            const { oldPassword, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.password_confirm_mismatch,
                });
            }

            const user = await Auth_Collection.findById(userId);

            if (!user) {
                return res.status(status_code.NOT_FOUND).json({
                    status: false,
                    message: responseMessage.userNotFound,
                });
            }

            const isOldPasswordMatched = bcrypt.compareSync(oldPassword, user.password);
            if (!isOldPasswordMatched) {
                return res.status(status_code.BAD_REQUEST).json({
                    status: false,
                    message: responseMessage.oldPassword_incorrect,
                });
            }

            const hashedPassword = bcrypt.hashSync(newPassword, 12);
            user.password = hashedPassword;
            await user.save();

            return res.status(status_code.SUCCESS).json({
                status: true,
                message: responseMessage.changePassword_success,
            });
        } catch (error) {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: responseMessage.changePassword_failed,
                error: error.message,
            });
        }
    }

