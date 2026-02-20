import { responseMessage, status_code } from "../../common";
import { Category_Collection } from "../../model";

// ================= Get All Category =================
export const getCategories = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const data = await Category_Collection.find({ isDelete: false }).populate("user", "name email");
      return res.status(status_code.SUCCESS).json({ status: true, message: responseMessage.allCategoriesGet_success, data });
    }

    const data = await Category_Collection.findOne({ user: req.user._id, isDelete: false }).populate("user", "name email");
    return res.status(status_code.SUCCESS).json({ status: true, message: responseMessage.allCategoriesGet_success, data });

  } catch (error) {
    return res.status(status_code.BAD_REQUEST).json({ status: false, message: responseMessage.allCategoriesGet_failed, error });
  }
};

// ================= Add new Category =================
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ status: false, message: "Category name is required" });
    }

    const normalized = name.trim();

    let doc = await Category_Collection.findOne({ user: req.user._id, isDelete: false });

    if (doc) {
      const exists = doc.categories.some((c) => (c || "").toString().trim().toLowerCase() === normalized.toLowerCase());
      if (exists) {
        return res.status(400).json({ status: false, message: "Category already exists." });
      }

      doc.categories.push(normalized);
      await doc.save();
      return res.status(status_code.SUCCESS).json({ status: true, message: responseMessage.categoryAdded_success, data: doc });
    }

    const created = await Category_Collection.create({ user: req.user._id, categories: [normalized] });
    return res.status(status_code.SUCCESS).json({ status: true, message: responseMessage.categoryAdded_success, data: created });

  } catch (error) {
    return res.status(status_code.BAD_REQUEST).json({ status: false, message: responseMessage.categoryAdded_failed, error });
  }
};


// ================= Update All Category =================
export const updateCategory = async (req, res) => {
  try {
    const { oldName, newName, userId } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({ status: false, message: "Both oldName and newName are required" });
    }

    const targetUser = req.user.role === "admin" && userId ? userId : req.user._id;

    const doc = await Category_Collection.findOne({ user: targetUser, isDelete: false });
    if (!doc) return res.status(404).json({ status: false, message: "Category document not found" });

    const oldNorm = oldName.toString().trim().toLowerCase();
    const newNorm = newName.toString().trim();

    const duplicate = doc.categories.some((c) => (c || "").toString().trim().toLowerCase() === newNorm.toLowerCase());
    if (duplicate) {
      return res.status(400).json({ status: false, message: "Category already exists." });
    }

    const idx = doc.categories.findIndex((c) => (c || "").toString().trim().toLowerCase() === oldNorm);
    if (idx === -1) return res.status(404).json({ status: false, message: "Category to update not found" });

    doc.categories[idx] = newNorm;
    await doc.save();

    return res.status(status_code.SUCCESS).json({ status: true, message: responseMessage.categoryUpdate_success, data: doc });

  } catch (error) {
    return res.status(status_code.BAD_REQUEST).json({ status: false, message: responseMessage.categoryUpdate_failed, error });
  }
};


// =================Soft Delete  Category =================
export const deleteCategory = async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name) return res.status(400).json({ status: false, message: "Category name is required" });

    const targetUser = req.user.role === "admin" && userId ? userId : req.user._id;

    const doc = await Category_Collection.findOne({ user: targetUser, isDelete: false });
    if (!doc) return res.status(404).json({ status: false, message: "Category document not found" });

    const norm = name.toString().trim().toLowerCase();
    const filtered = doc.categories.filter((c) => (c || "").toString().trim().toLowerCase() !== norm);

    if (filtered.length === doc.categories.length) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    doc.categories = filtered;
    await doc.save();

    return res.status(status_code.SUCCESS).json({ status: true, message: responseMessage.categoryDeleted_success, data: doc });

  } catch (error) {
    return res.status(status_code.BAD_REQUEST).json({ status: false, message: responseMessage.categoryDeleted_failed, error });
  }
};
