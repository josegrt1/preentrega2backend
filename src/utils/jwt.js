import jwt from "jsonwebtoken";

export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

export const cookieExtractor = (req) => {
  const cookieName = process.env.JWT_COOKIE_NAME || "authToken";
  return req?.cookies?.[cookieName] || null;
};