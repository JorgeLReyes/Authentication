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

    PassportAuthService.getInstance();

    // router.get("/google", controller.redirectToGoogle);
    router.route("/google/cb").get(controller.callbackGoogle);
    router.get("/login-google", controller.loginGoogle);
    router.get("/register-google", controller.registerGoogle);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.get("/register", (req, res) => res.render("google"));
    router.post("/logout", controller.logoutUser);
    router.get("/session", controller.session);
    router.get("/protected", AuthMiddleware.validateJWT, (req, res) => {
      res.render("protected", req.body.session?.user);
    });
    return router;
  }
}
