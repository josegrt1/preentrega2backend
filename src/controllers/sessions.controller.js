import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import SessionsService from "../services/sessions.service.js";

const sessionsService = new SessionsService();

export const registerUser = async (req, res) => {
  try {
    const result = await sessionsService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const loginUser = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Login inválido"
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      cart: user.cart
    });

    const cookieName = process.env.JWT_COOKIE_NAME || "authToken";

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    return res.json({
      status: "success",
      message: "Login OK"
    });
  })(req, res, next);
};

export const getCurrentUser = (req, res) => {
  const result = sessionsService.getCurrentUser(req.user);
  return res.json(result);
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await sessionsService.forgotPassword(req.body.email);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await sessionsService.resetPassword(
      req.body.token,
      req.body.newPassword
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Error interno"
    });
  }
};