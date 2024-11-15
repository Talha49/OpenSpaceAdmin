// models/Role.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  roleDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  permissions: { type: [String], required: true },
  created: { type: CreatedSchema, required: true },
  // permissionGroupID: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "PermissionGroup",
  //     required: true,
  //   },
  // ],
});

const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

export default Role;
