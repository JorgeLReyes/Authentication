import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envs } from "../../../config/envs";
import { GoogleUserDto } from "../../../domain/dtos/auth/google-user.dto";
import type { GoogleUser } from "../../../types";
import { NextFunction, Request, Response } from "express";

export class PassportAuthService {
  static strategyWithGoogle() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: envs.GOOGLE_CLIENT_ID,
          clientSecret: envs.GOOGLE_CLIENT_SECRET,
          callbackURL: `${envs.DOMAIN}${envs.GOOGLE_CALLBACK}`,
        },
        async (accessToken, refreshToken, profile, cb) => {
          const [error, googleUserDto] = GoogleUserDto.create(
            profile as GoogleUser
          );
          if (error) return cb(error);
          return cb(null, googleUserDto);
        }
      )
    );
  }

  static authenticateWithGoogle = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("google", {
      // session: false,
      successRedirect: "/api/auth/google/sucess",
      failureRedirect: "/api/auth/google/fail",
    })(req, res, next);
  };
  static redirectToGoogle = () => {
    return passport.authenticate("google", { scope: ["profile", "email"] });
  };
}
