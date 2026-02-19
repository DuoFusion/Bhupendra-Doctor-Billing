import mongoose, { Document } from "mongoose";
import { modelName } from "../common";

export interface OTPDocument extends Document {
  email: string;
  otp: string;
  expireAt: Date;
}

const otpSchema = new mongoose.Schema<OTPDocument>(
  {
    email: { type: String,  },
    otp: { type: String,  },
    expireAt: { type: Date,  },
  },
  { timestamps: true }
);

export const OTP_Collection = mongoose.model<OTPDocument>(
  modelName.otpModelName,
  otpSchema
);
