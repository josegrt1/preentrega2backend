import jwt from "jsonwebtoken";

export const generateResetToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

export const verifyResetToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);