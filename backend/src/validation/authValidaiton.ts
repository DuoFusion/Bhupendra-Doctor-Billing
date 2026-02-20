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

