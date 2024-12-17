// models/Role.js
import mongoose, { Schema } from "mongoose";

// Assuming CreatedSchema is a separate file for custom metadata
import { CreatedSchema } from "./CreatedSchema";

// Define the Role Schema
const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures that role names are unique
    },
    description: {
      type: String,
      required: true,
    },
    permissions: {
      menuPermissions: {
        type: Schema.Types.Mixed, // Flexible structure for menu permissions
        required: true,
      },
      formPermissions: {
        type: Schema.Types.Mixed, // Flexible structure for form permissions
        required: true,
      },
      reportPermissions: {
        type: Schema.Types.Mixed, // Flexible structure for report permissions
        required: true,
      },
      workflowPermissions: {
        type: Schema.Types.Mixed, // Flexible structure for workflow permissions
        required: true,
      },
    },
    created: {
      type: CreatedSchema, // Custom schema for creation metadata
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically, if not already defined
  }
);

// Create the Role model (if not already created)
export default mongoose.models.Role || mongoose.model("Role", roleSchema);
