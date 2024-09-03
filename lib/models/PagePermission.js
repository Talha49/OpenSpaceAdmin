import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const AttributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permission: {
    type: String,
    enum: ["create", "read", "update", "delete"],
    required: true,
  },
});

const PagePermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  entityName: { type: String, required: true },
  attributes: [{ type: AttributeSchema, required: true }],
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

const PagePermission =
  mongoose.models.PagePermission ||
  mongoose.model("PagePermission", PagePermissionSchema);

export default PagePermission;
