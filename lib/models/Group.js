// models/Group.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  groupDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active", // Default value for status
    required: true,
  },
  created: { type: CreatedSchema, required: true },
  groupType: {
    type: String,
    enum: ["Type 1", "Type 2", "Type 3"], // or whatever types you want to support
    required: true,
  },
  groupOwrnerID: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  groupTargetID: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
});

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
