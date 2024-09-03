// models/Group.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  groupDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  created: { type: CreatedSchema, required: true },
  groupOwrnerID: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  groupTargetID: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  roleID: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  ],
});

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
