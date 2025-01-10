import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { GoogleAuthService } from "../../../presentation/services/auth/google.service";
import { User } from "../../entities/user.entity";
import { JWTAdapter } from "../../../config/jwt";
import { configCookies } from "../../../config/cookies";

export class CallbackGoogleAuth {
  execute(service: GoogleAuthService) {
    return async (req: Request, res: Response, next: NextFunction) => {
      return passport.authenticate(
        "google",
        { session: false },
        (error, informationUser) => {
          const option = req.cookies["x-strategy"];
          service
            .handleUserProfile<User>(option, informationUser)
            .then(async (user) => {
              const { username, id } = user!;

              const token = {
                user: { username },
                token:
                  "Bearer " +
                  (await JWTAdapter.signToken({
                    payload: {
                      id,
                      username,
                    },
                  })),
              };
              res.cookie("access_token", token, configCookies);

              // res.json({ token });
              res.redirect("/api/auth/protected");
              // next();
              // res.redirect("/api/auth/protected");
            })
            .catch((error) => {
              res.json({ error: error.message });
              next();
            });
        }
      )(req, res, next);
    };
  }
}
