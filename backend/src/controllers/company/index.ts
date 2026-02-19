import fs from "fs";
import path from "path";
import { Company_Collection } from "../../model";
import { companyDataValidation, companyUpdateDataValidation } from "../../validation";
import { responseMessage, status_code } from "../../common";

const uploadDir = path.join(process.cwd(), "upload");


// ================= Add New Company =================
export const addNewCompany = async (req, res) => {

  const { error } = companyDataValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message
    });
  }

  try {
    const logoImage = req.file ? req.file.filename : null;

    const result = await Company_Collection.create({
      user: req.user._id,
      ...req.body,
      logoImage
    });

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.newCompanyAdded_success,
      result
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.newCompanyAdded_failed,
      error: error.message
    });
  }
};


// ================= Get All Companies (Admin + User Based) =================
export const getAllCompanies = async (req, res) => {

  try {
    let companies;

    if (req.user.role === "admin") {
      companies = await Company_Collection.find({ isDelete: false })
        .populate("user");
    } else {
      companies = await Company_Collection.find({
        user: req.user._id,
        isDelete: false
      }).populate("user");
    }

    res.status(status_code.SUCCESS).json({
      status: true,
      companies
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: error.message
    });
  }
};


// ================= Get Company by ID =================
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    let company;

    if (req.user.role === "admin") {
      company = await Company_Collection.findById(id);
    } else {
      company = await Company_Collection.findOne({
        _id: id,
        user: req.user._id
      });
    }

    if (!company) {
      return res.status(404).json({
        status: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      status: true,
      company,
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};



// ================= Update Company =================
export const updateCompany = async (req, res) => {

  const { error } = companyUpdateDataValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message
    });
  }

  try {
    const { id } = req.params;

    let company;

    if (req.user.role === "admin") {
      company = await Company_Collection.findById(id);
    } else {
      company = await Company_Collection.findOne({
        _id: id,
        user: req.user._id
      });
    }

    if (!company) {
      return res.status(status_code.NOT_FOUND).json({
        status: false,
        message: "Company not found"
      });
    }

    if (req.file) {
      if (company.logoImage) {
        const oldPath = path.join(uploadDir, company.logoImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      company.logoImage = req.file.filename;
    }

    Object.assign(company, req.body);

    const result = await company.save();

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.companyUpdate_success,
      result
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.companyUpdate_failed,
      error: error.message
    });
  }
};


// ================= Delete Company (Soft Delete) =================
export const deleteCompany = async (req, res) => {

  try {
    const { id } = req.params;

    let company;

    if (req.user.role === "admin") {
      company = await Company_Collection.findById(id);
    } else {
      company = await Company_Collection.findOne({
        _id: id,
        user: req.user._id
      });
    }

    if (!company) {
      return res.status(status_code.NOT_FOUND).json({
        status: false,
        message: "Company not found"
      });
    }

    company.isDelete = true;
    await company.save();

    res.status(status_code.SUCCESS).json({
      status: true,
      message: responseMessage.companyDeleted_success
    });

  } catch (error) {
    res.status(status_code.BAD_REQUEST).json({
      status: false,
      message: responseMessage.companyDeleted_failed,
      error: error.message
    });
  }
};
