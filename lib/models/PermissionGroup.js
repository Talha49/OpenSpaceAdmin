// models/PermissionGroup.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const PermissionGroupSchema = new mongoose.Schema({
  permissionGroupName: { type: String, required: true },
  permissionGroupDescription: { type: String },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  created: { type: CreatedSchema, required: true },
  pagePermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PagePermission', required: true }],
  menuPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuPermission', required: true }],
});


const PermissionGroup =
  mongoose.models.PermissionGroup ||
  mongoose.model("PermissionGroup", PermissionGroupSchema);

export default PermissionGroup;
