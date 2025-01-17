import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthDatasourceImpl } from "../../../infraestructure/datasources/user.datasource";
import { AuthRepositoryImpl } from "../../../infraestructure/repositories/user.repositoy";
import { PassportAuthService } from "../../services/auth/passport.service";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
// import { GoogleOAuth } from "../../services/auth/google";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const repository = new AuthRepositoryImpl(new AuthDatasourceImpl());
    const controller = new AuthController(repository, PassportAuthService);

    PassportAuthService.strategyWithGoogle();

    router.get("/google/cb", controller.processGoogleAuthCallback);
    router.get("/google/login", controller.loginWithGoogle);
    router.get("/google/register", controller.registerWithGoogle);
    router.get("/google/sucess", controller.sucessWithGoogle);
    router.get("/google/fail", controller.failWithGoogle);

    router.post("/login", controller.loginWithCredentials);
    router.post("/register", controller.registerWithCredentials);

    router.post(
      "/logout",
      [AuthMiddleware.validateToken, AuthMiddleware.revokeToken],
      controller.logout
    );
    router.get("/protected", AuthMiddleware.validateToken, (req, res) => {
      res.render("protected", req.body.session?.user);
    });
    return router;
  }
}
