import { NextFunction, Request, Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl } from "../../../infraestructure/datasources/user.datasource";
import { AuthRepositoryImpl } from "../../../infraestructure/repositories/user.repositoy";
import { PassportAuthService } from "../../services/auth/passport.service";
import { GoogleAuthService } from "../../services/auth/google.service";
import { AuthMiddleware } from "../../middlewares/auth";
// import { GoogleOAuth } from "../../services/auth/google";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const repository = new AuthRepositoryImpl(new AuthDatasourceImpl());
    const serviceGoogle = new GoogleAuthService(repository);
    const controller = new AuthController(repository, serviceGoogle);

    PassportAuthService.strategyWithGoogle();

    // router.get("/google", controller.redirectToGoogle);
    router.route("/google/cb").get(controller.processGoogleAuthCallback);
    router.get("/google/login", controller.loginWithGoogle);
    router.get("/google/register", controller.registerWithGoogle);

    router.post("/login", controller.loginWithCredentials);
    router.post("/register", controller.registerWithCredentials);
    // router.get("/register", (req, res) => res.render("google"));
    router.post("/logout", controller.logout);
    router.get("/protected", AuthMiddleware.validateJWT, (req, res) => {
      res.render("protected", req.body.session?.user);
    });
    return router;
  }
}
