import { Router } from "express";
import passport from "passport";

import { UserModel } from "../models/user.model.js";
import { CartModel } from "../models/cart.model.js";
import { createHash } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();


router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: "error", message: "Faltan campos" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ status: "error", message: "Email ya registrado" });
    }

    const newCart = await CartModel.create({ products: [] });

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: "user"
    });

    return res.status(201).json({
      status: "success",
      message: "Usuario creado",
      payload: { id: newUser._id, email: newUser.email }
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});


router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ status: "error", message: info?.message || "Login inválido" });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const cookieName = process.env.JWT_COOKIE_NAME || "authToken";

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    return res.json({ status: "success", message: "Login OK" });
  })(req, res, next);
});


router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const { password, ...safeUser } = req.user;
    return res.json({ status: "success", payload: safeUser });
  }
);

export default router;