// lib/models/User.js
import mongoose from "mongoose";
import { CreatedSchema } from "./CreatedSchema";

const userSchema = new mongoose.Schema(
  {
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
    token: {
      type: String,
    },
    createdByAdmin: {
      type: Boolean,
      default: null, // Default is null if not explicitly set
    },
    multifactorAuthentication: {
      // New field for MFA
      type: Boolean,
      default: false, // Default MFA status is off
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export default mongoose.models.User || mongoose.model("User", userSchema);

// //  created: { type: CreatedSchema, required: true },
// userTypeID: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "UserType",
//   required: true,
// },
