import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl } from "../../../infraestructure/datasources/user.datasource";
import { AuthRepositoryImpl } from "../../../infraestructure/repositories/user.repositoy";
import { AuthMiddleware } from "../../middlewares/auth";

export class AuthRoutes {
  static get routes(): Router {
    const repository = new AuthRepositoryImpl(new AuthDatasourceImpl());
    const controller = new AuthController(repository);

    const router = Router();
    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.post("/logout", controller.logoutUser);
    router.get("/protected", AuthMiddleware.validateJWT, (req, res) => {
      res.render("protected", req.body.session?.user);
    });
    return router;
  }
}
