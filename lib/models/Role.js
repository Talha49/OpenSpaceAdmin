// models/Role.js
import mongoose from "mongoose";
import PermissionGroup from "./PermissionGroup";
import { CreatedSchema } from "./CreatedSchema";

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  roleDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  created: { type: CreatedSchema, required: true },
  permissionGroupID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PermissionGroup",
      required: true,
    },
  ],
});

const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

export default Role;
