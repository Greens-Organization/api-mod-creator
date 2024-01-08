// src/models/UserAccess.ts
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const useAccessSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: "create_at", updatedAt: "update_at" } },
);

const UseAccess = mongoose.model("UseAccess", useAccessSchema);

export default UseAccess;
