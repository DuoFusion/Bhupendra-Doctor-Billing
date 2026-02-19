import { Auth_Collection, OTP_Collection } from "../../model";
import bcrypt from "bcryptjs";
import { responseMessage, status_code } from "../../common";
import { otpSender } from "../../helper";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { signInValidation, signUpValidation } from "../../validation";
dotenv.config()

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
                const record = await OTP_Collection.findOne({email , otp});

                if(!record){
                    return res.status(status_code.BAD_REQUEST).json({status : false , message : "OTP is incorrect !" });
                }

                if(record.expireAt < new Date(Date.now())){
                    return res.status(status_code.BAD_REQUEST).json({status : false , message : "OTP is expired !"});
                }

                await OTP_Collection.deleteMany({email});

                const user = await Auth_Collection.findOne({email});
                const token = jwt.sign({user : {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role
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
