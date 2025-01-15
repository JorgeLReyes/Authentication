import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../config/jwt";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/user.repositoy";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/user.datasource";

export class AuthMiddleware {
  static repository = new AuthRepositoryImpl(new AuthDatasourceImpl());

  private static async verifyToken(token: string) {
    const accessToken = token.split(" ")[1] || "";
    const data = await JWTAdapter.verifyToken(accessToken);
    if (!data) throw "Token expired";
    const user = await AuthMiddleware.repository.findUserByEmail(
      // @ts-ignore
      data.email
    );
    if (!user) throw "Invalid token";
    return { user: data };
  }

  static async hasToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
    if (token) {
      try {
        const session = await AuthMiddleware.verifyToken(token);
        req.body.session = session;
      } catch (error) {
        console.log(error);
        res.clearCookie("access_token").status(403).json({ error });
        return;
      }
    }
    next();
  }

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
    if (!token) {
      res.status(403).json({ error: "Access not authorized" });
      return;
    }

    if (!token.startsWith("Bearer ")) {
      res
        .clearCookie("access_token")
        .status(403)
        .json({ error: "Invalid token format" });
      return;
    }

    try {
      const session = await AuthMiddleware.verifyToken(token);
      req.body.session = session;
      next();
    } catch (error) {
      res.clearCookie("access_token").status(403).json({ error });
    }
  }
}
