import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../config/jwt";

export class AuthMiddleware {
  static async hasToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
    console.log(token);
    if (token) {
      try {
        const accessToken = token.split(" ")[1] || "";
        const data = await JWTAdapter.verifyToken(accessToken);
        console.log(data);
        req.body.session = { user: data };
      } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
    }
    next();
  }
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    console.log(req.cookies.access_token);
    const token = req.cookies.access_token;
    if (!token) {
      res.status(403).json({ error: "Access not authorized" });
      return;
    }

    if (!token.startsWith("Bearer ")) {
      res.status(403).json({ error: "Invalid token format" });
      return;
    }

    try {
      const accessToken = token.split(" ")[1] || "";
      const data = await JWTAdapter.verifyToken(accessToken);
      req.body.session = { user: data };
      next();
    } catch (error) {
      res.status(403).json({ error: "Invalid token" });
    }
  }
}
