import Joi from "joi"

export const companyDataValidation = Joi.object({
    companyName: Joi.string().min(3).max(200).trim(),
    gstNumber: Joi.string().length(15).trim(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email().trim(),
    address: Joi.string().min(5).max(500).trim(),
    city: Joi.string().min(2).max(100).trim(),
    state: Joi.string().min(2).max(100).trim(),
    pincode: Joi.number().integer().min(100000).max(999999)
});

export const companyUpdateDataValidation = Joi.object({
    companyName: Joi.string().min(3).max(200).trim(),
    gstNumber: Joi.string().length(15).trim(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email().trim(),
    address: Joi.string().min(5).max(500).trim(),
    city: Joi.string().min(2).max(100).trim(),
    state: Joi.string().min(2).max(100).trim(),
    pincode: Joi.number().integer().min(100000).max(999999)
});

