import express from "express";
import { authenticate } from "../middlewares/index.js";
import { uploadAvatar, getAvatar } from "../controllers/users.js";
import storage from "../middlewares/upload.js";
const usersRouter = express.Router();

usersRouter.patch(
  "/avatar",
  authenticate,
  storage.single("avatar"),
  uploadAvatar
);
usersRouter.get(
  "/avatar",
  authenticate,
  getAvatar
);

export default usersRouter;
