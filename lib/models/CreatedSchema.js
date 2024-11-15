import mongoose from "mongoose";

export const CreatedSchema = new mongoose.Schema({
    by: { type: String, required: true },
    at: { type: Date, required: true, default: Date.now },
  });