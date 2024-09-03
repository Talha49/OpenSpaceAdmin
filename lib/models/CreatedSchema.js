import mongoose from "mongoose";

export const CreatedSchema = new mongoose.Schema({
    by: { type: Number, required: true },
    at: { type: Date, required: true, default: Date.now },
  });