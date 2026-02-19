import { responseMessage, status_code } from "../../common";
import { Product_Collection } from "../../model";
import { productDataValidation, productUpdateDataValidation } from "../../validation";


// ================= Get All Products (Admin) =================
export const getAllProducts = async (req, res) => {
  try {
    let products;

    if (req.user.role === "admin") {
      products = await Product_Collection
        .find({ isDelete: false })
        .populate("company")
        .populate("user", "name email role");
    } else {
      products = await Product_Collection
        .find({ isDelete: false, user: req.user._id })
        .populate("company")
        .populate("user", "name email role");
    }

    res.status(status_code.SUCCESS).json({
      status: true,
      products,
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.allProductsGet_failed,
      error,
    });
  }
};



// ================= Get My Products (User) =================
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product_Collection
      .find({ isDelete: false, user: req.user._id })
      .populate("company")
      .populate("user", "name email role");

    res.status(status_code.SUCCESS).json({
      status: true,
      message: "My products fetched successfully",
      products,
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: "Failed to fetch my products",
      error,
    });
  }
};


// ================= Add New Product =================
export const addNewProduct = async (req, res) => {

  const { error } = productDataValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }

  try {
    const result = await Product_Collection.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.newProductAdded_success,
      result,
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.newProductAdded_failed,
      error,
    });
  }
};

// ================= get Product By Id =================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product_Collection.findById(id)
      .populate("company")
      .populate("user", "name email role");

    if (!product || product.isDelete) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch product",
      error,
    });
  }
};


// ================= Update Product =================
export const updateProduct = async (req, res) => {

  const { error } = productUpdateDataValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }

  try {
    const { id } = req.params;

    const result = await Product_Collection.findOneAndUpdate(
      { _id: id, user: req.user._id, isDelete: false },
      req.body,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Product not found or unauthorized",
      });
    }

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.productUpdate_success,
      result,
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.productUpdate_failed,
      error,
    });
  }
};


// ================= Delete Product (Soft Delete) =================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let result;

    if (req.user.role === "admin") {
        result = await Product_Collection.findOneAndUpdate(
        { _id: id, isDelete: false },
        { isDelete: true },
        { new: true }
      );
    } else {
      result = await Product_Collection.findOneAndUpdate(
        { _id: id, user: req.user._id, isDelete: false },
        { isDelete: true },
        { new: true }
      );
    }

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Product not found or unauthorized",
      });
    }

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.productDeleted_success,
      result,
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.productDeleted_failed,
      error,
    });
  }
};
