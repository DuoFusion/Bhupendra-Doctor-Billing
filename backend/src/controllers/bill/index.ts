import { Bill_Collection, Product_Collection } from "../../model";
import { responseMessage, status_code } from "../../common";
import mongoose from "mongoose";
import { PAYMENT_METHOD } from "../../common/enum";

// ================= Get All Bills (Admin + User Based) =================
export const getAllBills = async (req, res) => {
  try {
    let bills;

    if (req.user.role === "admin") {
      bills = await Bill_Collection.find({ isDelete: false })
        .populate("user", "name email")
        .populate(
          "items.product",
          "productName category hsnCode batch expiry gstPercent mrp sellingPrice company"
        )
        .populate(
          "items.company"," companyName gstNumber phone email address city state pincode  logoImage" );
    } else {
      bills = await Bill_Collection.find({
        user: req.user._id,
        isDelete: false,
      })
        .populate("user", "name email")
        .populate(
          "items.product",
          "productName category hsnCode batch expiry gstPercent mrp sellingPrice company"
        )
        .populate(
          "items.company"," companyName gstNumber phone email address city state pincode  logoImage" );
    }

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.allBillsGet_success,
      bills,
    });
  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: error.message,
    });
  }
};


// ================= Get Single Bill =================
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.invalidBillId,
      });

    const bill = await Bill_Collection.findById(id)
      .populate("user", "name email")
      .populate("items.product", "productName category hsnCode batch expiry gstPercent mrp sellingPrice company")
      .populate("items.company"," companyName gstNumber phone email address city state pincode  logoImage" )

    if (!bill)
      return res.status(status_code.NOT_FOUND).json({
        status: false,
        message: responseMessage.billNotFound,
      });

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.billGet_success.replace("{billNumber}", bill.billNumber),
      bill,
    });
  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.billGet_failed,
      error: error.message,
    });
  }
};

// ================= Add New Bill =================
export const addBill = async (req, res) => {
  try {
    const { user, billStatus, items, paymentMethod, discount = 0 } = req.body;

    if (!user || !items || items.length === 0 || !paymentMethod) {
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.missingBillFields,
      });
    }

    if (!Object.values(PAYMENT_METHOD).includes(paymentMethod)) {
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.invalidPaymentMethod,
      });
    }

    let srNo = 1;
    let subTotal = 0;
    let totalGST = 0;
    const processedItems = [];

    for (let item of items) {
      const product = await Product_Collection.findById(item.product);
      if (!product)
        return res.status(status_code.NOT_FOUND).json({
          status: false,
          message: `Product not found: ${item.product}`,
        });

      const qty = Number(item.qty) || 0;
      const freeQty = Number(item.freeQty) || 0;
      const itemDiscount = Number(item.discount) || 0;

      const rate = Number(product.sellingPrice) || 0;
      const total = rate * qty - itemDiscount;
      const gstAmount = (total * Number(product.gstPercent)) / 100;

      processedItems.push({
        srNo: srNo++,
        product: product._id,
        productName: product.productName,
        category: product.category,
        hsnCode: product.hsnCode,
        qty,
        freeQty,
        mrp: product.mrp,
        rate,
        batch: product.batch || "",
        expiry: product.expiry || "",
        gstPercent: product.gstPercent,
        gstAmount,
        total,
        discount: itemDiscount,
        sgst: gstAmount / 2,
        cgst: gstAmount / 2,
        company: product.company,
      });

      subTotal += total;
      totalGST += gstAmount;
    }

    const grandTotal = subTotal + totalGST - Number(discount);
    const billNumber = `BILL-${Date.now()}`;

    const newBill = await Bill_Collection.create({
      billNumber,
      user,
      items: processedItems,
      subTotal,
      totalGST,
      discount,
      grandTotal,
      billStatus,
      paymentMethod,
    });

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.billAdd_success.replace("{billNumber}", billNumber),
      bill: newBill,
    });
  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.billAdd_failed,
      error: error.message,
    });
  }
};


// ================= Update Bill =================
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { user ,billStatus ,items, paymentMethod, discount = 0 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.invalidBillId,
      });
    }

    const existingBill = await Bill_Collection.findById(id);
    if (!existingBill || existingBill.isDelete) {
      return res.status(status_code.NOT_FOUND).json({
        status: false,
        message: responseMessage.billNotFound,
      });
    }

    if (!user || !items || items.length === 0 || !paymentMethod) {
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.missingBillFields,
      });
    }

    if (!Object.values(PAYMENT_METHOD).includes(paymentMethod)) {
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.invalidPaymentMethod,
      });
    }

    let srNo = 1;
    let subTotal = 0;
    let totalGST = 0;
    const processedItems = [];

    for (let item of items) {
      const product = await Product_Collection.findById(item.product);
      if (!product) {
        return res.status(status_code.NOT_FOUND).json({
          status: false,
          message: `Product not found: ${item.product}`,
        });
      }

      const qty = Number(item.qty) || 0;
      const freeQty = Number(item.freeQty) || 0;
      const itemDiscount = Number(item.discount) || 0;

      const rate = Number(product.sellingPrice) || 0;
      const total = rate * qty - itemDiscount;
      const gstAmount = (total * Number(product.gstPercent)) / 100;

      processedItems.push({
        srNo: srNo++,
        product: product._id,
        productName: product.productName,
        category: product.category,
        hsnCode: product.hsnCode,
        qty,
        freeQty,
        mrp: product.mrp,
        rate,
        batch: product.batch || "",
        expiry: product.expiry || "",
        gstPercent: product.gstPercent,
        gstAmount,
        total,
        discount: itemDiscount,
        sgst: gstAmount / 2,
        cgst: gstAmount / 2,
        company: product.company,
      });

      subTotal += total;
      totalGST += gstAmount;
    }

    const grandTotal = subTotal + totalGST - Number(discount);

    const updatedBill = await Bill_Collection.findByIdAndUpdate(
      id,
      {
        user,
        items: processedItems,
        subTotal,
        totalGST,
        discount,
        grandTotal,
        billStatus,
        paymentMethod,
      },
      { new: true }
    );

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.billUpdate_success.replace(
        "{billNumber}",
        updatedBill.billNumber
      ),
      bill: updatedBill,
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.billUpdate_failed,
      error: error.message,
    });
  }
};



// ================= Delete Bill (Soft Delete) =================
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(status_code.BAD_REQUEST).json({
        status: false,
        message: responseMessage.invalidBillId,
      });

    const bill = await Bill_Collection.findByIdAndUpdate(id, { isDelete: true }, { new: true });
    if (!bill)
      return res.status(status_code.NOT_FOUND).json({
        status: false,
        message: responseMessage.billNotFound,
      });

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.billDelete_success.replace("{billNumber}", bill.billNumber),
      bill,
    });
  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.billDelete_failed,
      error: error.message,
    });
  }
};
