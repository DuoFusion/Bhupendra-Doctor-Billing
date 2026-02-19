import Joi from "joi"

export const userValidaiton = Joi.object({
    email : Joi.string().email().trim().required(),
    name : Joi.string().min(3).max(200).trim().required(),
    role: Joi.required()
})