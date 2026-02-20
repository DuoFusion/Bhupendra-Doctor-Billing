import Joi from "joi";
import { STOCK_STATUS } from "../common/enum";

// ================= Add Product Validation =================
export const productDataValidation = Joi.object({
  productName: Joi.string().trim().min(2).max(100).required(),
  company: Joi.string().trim().length(24).required(),
  category: Joi.string().trim().required(),
  hsnCode: Joi.string().trim().min(4).max(10).required(),
  mrp: Joi.number().min(1).max(100000).required(),
  purchasePrice: Joi.number().min(0).max(100000).required(),
  sellingPrice: Joi.number().min(0).max(100000).required(),
  gstPercent: Joi.number().valid(0, 5, 12, 18, 28).required(),
  stock: Joi.number().min(0).max(100000).required(),
  minStock: Joi.number().min(0).max(10000).required(),
  stockStatus: Joi.string().valid(...Object.values(STOCK_STATUS)).required(),
  description: Joi.string().trim().max(500).allow(""),

  batch: Joi.string().trim().max(50).allow(""),  
  expiry: Joi.string().trim().max(10).allow(""),  
});

// ================= Update Product Validation =================
export const productUpdateDataValidation = Joi.object({
  productName: Joi.string().trim().min(2).max(100),
  company: Joi.string().trim().length(24),
  category: Joi.string().trim(),
  hsnCode: Joi.string().trim().min(4).max(10),
  mrp: Joi.number().min(1).max(100000),
  purchasePrice: Joi.number().min(0).max(100000),
  sellingPrice: Joi.number().min(0).max(100000),
  gstPercent: Joi.number().valid(0, 5, 12, 18, 28),
  stock: Joi.number().min(0).max(100000),
  minStock: Joi.number().min(0).max(10000),
  stockStatus: Joi.string().valid(...Object.values(STOCK_STATUS)),
  description: Joi.string().trim().max(500).allow(""),

  batch: Joi.string().trim().max(50).allow(""),
  expiry: Joi.string().trim().max(10).allow(""),
});
