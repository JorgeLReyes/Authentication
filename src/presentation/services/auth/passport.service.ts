import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envs } from "../../../config/envs";
import { GoogleUserDto } from "../../../domain/dtos/auth/google-user.dto";
import type { GoogleUser } from "../../../types";
import { CustomError } from "../../../config/error";

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
          try {
            if (error) throw CustomError.internalServer(error);
            return cb(null, googleUserDto);
          } catch (e) {
            console.log(e);
            return cb(error);
          }
        }
      )
    );

    // passport.serializeUser((user, done) => {
    //   console.log({ user });

    //   done(null, user);
    // });

    // passport.deserializeUser((user, done) => {
    //   console.log({ user });
    //   done(null, user!);
    // });
  }
}
