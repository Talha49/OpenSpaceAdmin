// lib/models/User.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active",
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  contact: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  isSocialLogin: {
    type: Boolean,
    default: false,
  },
  created: { type: CreatedSchema, required: true },
  userTypeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
    required: true,
  },
  token: {
    type: String,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
