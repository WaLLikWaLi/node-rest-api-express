import * as fs from "node:fs/promises";
import HttpError from "../helpers/HttpError.js";
import path from "node:path";
import { User } from "../models/user.js";
import Jimp from "jimp";

export const uploadAvatar = async (req, res, next) => {
  try {
    const image = await Jimp.read(req.file.path);
    await image
      .resize(250, 250)
      .writeAsync(req.file.path); 

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    next(HttpError(error.status, error.message));
  }
};

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!user.avatar) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatar));
  } catch (error) {
    console.log(error);
    next(HttpError(error.status, error.message));
  }
};
