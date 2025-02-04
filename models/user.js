import Joi from "joi";
import { Schema, model } from "mongoose";
import { mongooseError } from "../helpers/mongooseError.js";
const userSchema = new Schema(
  {
    name: {
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
      required: true,
      minlength: 6,
    },
    token: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: [false, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseError);

export const registerContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required().min(6),
});
export const verifyContactSchema = Joi.object({
  email: Joi.string().required(),
});

export const loginContactSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(6),
});

export const User = model("user", userSchema);
