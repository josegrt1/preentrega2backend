import { Router } from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  getCurrentUser
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;