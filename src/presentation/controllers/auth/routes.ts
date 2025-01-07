import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl } from "../../../infraestructure/datasources/user.datasource";
import { AuthRepositoryImpl } from "../../../infraestructure/repositories/user.repositoy";
import { AuthMiddleware } from "../../middlewares/auth";
import passport from "passport";
import { GoogleOAuth } from "../../services/auth/google";

export class AuthRoutes {
  static get routes(): Router {
    const repository = new AuthRepositoryImpl(new AuthDatasourceImpl());
    const controller = new AuthController(repository);

    const router = Router();
    GoogleOAuth.auth();
    router.get(
      "/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );
    router.route("/google/cb").get(
      passport.authenticate("google", {
        failureRedirect: "/",
        session: false,
      }),
      function (req, res) {
        res.redirect("/api/auth/protected");
      }
    );
    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.get("/register", (req, res) => {
      res.render("google");
    });
    router.post("/logout", controller.logoutUser);
    router.get("/protected", (req, res) => {
      res.render("protected", req.body.session?.user);
    });
    return router;
  }
}
