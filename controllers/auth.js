import HttpError from "../helpers/HttpError.js";
import {
  User,
  loginContactSchema,
  registerContactSchema,
  verifyContactSchema,
} from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/sendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { error } = registerContactSchema.validate(req.body);
    const { email, password } = req.body;
    if (error) {
      next(HttpError(400, error.message));
    }

    const user = await User.findOne({ email });
    if (user) {
      next(HttpError(409, "Email alredy in use"));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const verifyEmail = {
      to: email,
      subject: "verify email",
      html: `<a target = "_blank" href= "${BASE_URL}/api/auth/verify/${verificationCode}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatar: avatarURL,
      verificationCode,
    });
    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    console.log(error.name);
    next(HttpError(error.status, error.message));
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    next(HttpError(401, "Email not found"));
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });

  res.json({
    message: "Verify success",
  });
};

export const resendVerifyEmail = async (req, res) => {
  const { error } = verifyContactSchema.validate(req.body);

  if (error) {
    next(HttpError(400, error.message));
  }

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    next(HttpError(401, "Email not found"));
  }
  if (user.verify) {
    next(HttpError(401, "Email alredy verify"));
  }

  const verifyEmail = {
    to: email,
    subject: "verify email",
    html: `<a target = "_blank" href= "${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginContactSchema.validate(req.body);
    const { email, password } = req.body;

    if (error) {
      next(HttpError(400, error.message));
    }

    const user = await User.findOne({ email });

    if (!user) {
      next(HttpError(401, "Email or password invalid"));
    }

    if (!user.verify) {
      next(HttpError(401, "Email not verified"));
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      next(HttpError(401, "Email or password invalid"));
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error.name);
    next(HttpError(error.status, error.message));
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
      message: "Logout succses",
    });
  } catch (error) {
    console.log(error.name);
    next(HttpError(error.status, error.message));
  }
};

export const getCurrent = async (req, res, next) => {
  const { email, name } = req.user;

  try {
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.json({
      email,
      name,
    });
  } catch (error) {
    console.log(error.name);
    next(HttpError(error.status, error.message));
  }
};
