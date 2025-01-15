import { Router } from "express";
import { AuthRoutes } from "../controllers/auth/auth.routes";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AppRouter {
  static get routes(): Router {
    const router = Router();
    router.get("/", AuthMiddleware.hasToken, (req, res): any => {
      res.render("index", req.body.session?.user);
    });
    router.use("/api/auth", AuthRoutes.routes);
    return router;
  }
}
