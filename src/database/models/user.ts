// src/models/User.ts
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { createId } from "@paralleldrive/cuid2";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => createId(),
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
    },
    level: {
      type: String,
      required: true,
      enum: ["admin", "manager", "user"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: { createdAt: "create_at", updatedAt: "update_at" } },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 16;

  try {
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    console.error("Problem encrypting password");
    next();
  }
});

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
