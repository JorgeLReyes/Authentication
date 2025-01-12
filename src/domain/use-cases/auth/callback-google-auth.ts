import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { GoogleAuthService } from "../../../presentation/services/auth/google.service";
import { User } from "../../entities/user.entity";
import { JWTAdapter } from "../../../config/jwt";
import { configCookies } from "../../../config/cookies";
import { envs } from "../../../config/envs";

export class CallbackGoogleAuth {
  execute(service: GoogleAuthService) {
    return async (req: Request, res: Response, next: NextFunction) => {
      return passport.authenticate(
        "google",
        { session: false },
        (error, informationUser) => {
          console.log({ error, informationUser });
          if (error) {
            console.log(error);

            res.render("redirect", {
              redirect: "/",
              domain: envs.DOMAIN,
              authFail: true,
            });
            next();
            return;
          }

          const option = req.cookies["x-strategy"];
          service
            .handleUserProfile<User>(option, informationUser)
            .then(async (user) => {
              const { username, id } = user!;

              const token =
                "Bearer " +
                (await JWTAdapter.signToken({
                  payload: {
                    id,
                    username,
                  },
                }));

              (<any>req.session).auth = true;

              res
                .cookie("access_token", token, configCookies)
                .render("redirect", { redirect: "/", domain: envs.DOMAIN });
              // .json({ redirect: "/api/auth/protected" });
              next();
              // res.redirect("/api/auth/protected");
            })
            .catch((error) => {
              console.log(error);
              // req.session.auth = false;
              (<any>req.session).auth = false;
              res.render("redirect", {
                redirect: "/",
                domain: envs.DOMAIN,
                authFail: true,
              });
              // res.json({ error: error.message });
              next();
            });
        }
      )(req, res, next);
    };
  }
}
