import mongoose from "mongoose";
import { modelName } from "../common";

const categorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: modelName.authModelName, unique: true, required: true },
    categories: [{ type: String }],
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const Category_Collection = mongoose.model(modelName.categoryModelName, categorySchema);
