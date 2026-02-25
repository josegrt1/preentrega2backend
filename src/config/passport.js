import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/password.js";
import { cookieExtractor } from "../utils/jwt.js";

export const initializePassport = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) return done(null, false, { message: "Usuario no encontrado" });

          if (!isValidPassword(password, user.password))
            return done(null, false, { message: "Password incorrecta" });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          const user = await UserModel.findById(payload.id).lean();
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );


  passport.use("current", passport._strategy("jwt"));
};