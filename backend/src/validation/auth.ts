import Joi from "joi"

export const signUpValidation = Joi.object({
    name : Joi.string().min(5).max(50).required().trim(),
    email : Joi.string().email().required().trim(),
    password : Joi.string().min(5).required().trim(),
    role : Joi.string().required().trim()
})

export const signInValidation = Joi.object({
    email : Joi.string().email().required().trim(),
    password : Joi.string().min(5).required().trim()
})

export const updateProfileValidation = Joi.object({
    name : Joi.string().min(5).max(50).optional().trim(),
    email : Joi.string().email().optional().trim(),
    phone : Joi.string().optional().trim(),
    address : Joi.string().optional().trim(),
    city : Joi.string().optional().trim(),
    state : Joi.string().optional().trim(),
    pincode : Joi.string().optional().trim()
})

export const changePasswordValidation = Joi.object({
    oldPassword: Joi.string().min(5).required().trim(),
    newPassword: Joi.string().min(5).required().trim(),
    confirmPassword: Joi.string().min(5).required().trim()
})

export const forgotPasswordSendOtpValidation = Joi.object({
    email: Joi.string().email().required().trim()
})

export const forgotPasswordVerifyOtpValidation = Joi.object({
    email: Joi.string().email().required().trim(),
    otp: Joi.string().length(6).required().trim()
})

export const forgotPasswordResetValidation = Joi.object({
    email: Joi.string().email().required().trim(),
    otp: Joi.string().length(6).required().trim(),
    newPassword: Joi.string().min(5).required().trim(),
    confirmPassword: Joi.string().min(5).required().trim()
})

