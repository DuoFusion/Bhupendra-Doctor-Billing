    import nodemailer  from "nodemailer"
    import { OTP_Collection } from "../model"
    import dotenv from "dotenv"
    import { responseMessage } from "../common";
    dotenv.config();

    /*============ OTP Transporter ===========*/
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL , 
            pass : process.env.PASS
        }
    });



    /*============ OTP Generator function ===========*/
    const generateOTP = ()=>{
        return Math.floor(100000 + Math.random() * 900000)
    };

    export interface IOTP {
    email: string;
    otp: string;
    expireAt?: Date;
    }

    /*============ OTP Sender ===========*/
export const otpSender = async (email : string)=>{
    const otp = generateOTP()
    const expireAt = new Date(Date.now() + (1000 * 60 * 3)) // otp valid for 3min

    try {
        await OTP_Collection.deleteMany({ email, purpose: "signin" } as any);
        await OTP_Collection.create({email,otp,expireAt,purpose: "signin"} as any);
        await transporter.sendMail({
                from: `Security Team <${process.env.EMAIL}>`, 
                to: email,
                subject: "Your Account OTP Verification",
                text: `Hello,

            Your One-Time Password (OTP) for account verification is: ${otp}
            This OTP is valid for 3 minutes.

            If you did not request this verification, you can safely ignore this email.

            – Security Team`
            });

            return {status : true , message : responseMessage.otp_sent}
        } catch (error) {
            return {status : false , message :responseMessage.otp_notSent}
        }
    }
