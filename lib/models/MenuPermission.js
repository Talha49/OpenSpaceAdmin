// models/MenuPermission.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";
import { type } from "express/lib/response";

const MenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  permission: {
    type: String,
    enum: ["create", "read", "update", "delete"],
    required: true,
  },
});

const MenuPermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menu: [{ type: MenuSchema, required: true }],
  crud: [
    {
      type: String,
      enum: ["create", "read", "update", "delete"],
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  created: { type: CreatedSchema, required: true },
});

const MenuPermission =
  mongoose.models.MenuPermission ||
  mongoose.model("MenuPermission", MenuPermissionSchema);

export default MenuPermission;
