import axios from "axios";
import { URL_KEYS } from "../constants/Url";

const API = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true,
});

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: string; 
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const signupUser = async (data: SignupPayload) => {
  const response = await API.post(URL_KEYS.AUTH.SIGNUP , data);
  return response.data;
};


export const signinUser = async (data: SigninPayload) => {
  const response = await API.post(URL_KEYS.AUTH.SIGNIN , data);
  return response.data;
};

export const verifyOtpUser = async (data: VerifyOtpPayload) => {
  const response = await API.post( URL_KEYS.AUTH.OTP_VERIFICATION , data);
  return response.data;
};

export const getCurrentUser = async ()=>{
  const response = await API.get(URL_KEYS.AUTH.GET_CURRENT_USER);
  return response.data;
};

export const signout = async () => {
  const response = await API.post(URL_KEYS.AUTH.SIGNOUT, {}, { withCredentials: true });
  return response.data;
};