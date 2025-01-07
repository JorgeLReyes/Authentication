import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envs } from "../../../config/envs";

export class GoogleOAuth {
  static auth() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: envs.GOOGLE_CLIENT_ID,
          clientSecret: envs.GOOGLE_CLIENT_SECRET,
          callbackURL: envs.GOOGLE_CALLBACK,
        },
        function (accessToken, refreshToken, profile, cb) {
          // const response = profile;
          console.log(profile);
          return cb(null, profile);
          // User.findOrCreate({ googleId: profile.id }, function (err, user) {
          //   return cb(err, user);
          // });
        }
      )
    );
  }
}
