// models/UserType.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const UserTypeSchema = new mongoose.Schema({
  typeName: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  created: { type: CreatedSchema, required: true },
});

const UserType =
  mongoose.models.UserType || mongoose.model("UserType", UserTypeSchema);

export default UserType;
