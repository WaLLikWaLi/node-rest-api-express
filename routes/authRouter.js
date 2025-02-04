import express, { Router } from "express";
import {
  register,
  login,
  getCurrent,
  logout,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/auth.js";
import { authenticate } from "../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrent);

authRouter.get("/verify/:verificationCode", verifyEmail);

authRouter.post("/verify", resendVerifyEmail);

export default authRouter;
