import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envs } from "../../../config/envs";
import { GoogleUserDto } from "../../../domain/dtos/auth/google-user.dto";
import type { GoogleUser } from "../../../types";
import { CustomError } from "../../../config/error";

export class PassportAuthService {
  private static instance: PassportAuthService;
  private strategyRegistered = false;

  private constructor() {
    if (!this.strategyRegistered) {
      this.strategyRegistered = true;
      this.strategyLogin();
    }
  }

  private strategyLogin() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: envs.GOOGLE_CLIENT_ID,
          clientSecret: envs.GOOGLE_CLIENT_SECRET,
          callbackURL: `${envs.GOOGLE_CALLBACK}`,
        },
        async (accessToken, refreshToken, profile, cb) => {
          const [error, googleUserDto] = GoogleUserDto.create(
            profile as GoogleUser
          );

          if (error) throw CustomError.internalServer(error);
          try {
            return cb(null, googleUserDto);
          } catch (e) {
            console.log(e);
            return cb(true);
          }
        }
      )
    );
  }

  public static getInstance() {
    if (!PassportAuthService.instance) {
      return (PassportAuthService.instance = new PassportAuthService());
    }
    return PassportAuthService.instance;
  }
}
