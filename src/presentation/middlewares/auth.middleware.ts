import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../config/jwt";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/user.repositoy";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/user.datasource";
import { configCookies } from "../../config/cookies";
import { envs } from "../../config/envs";
import { TokenRepositoryImpl } from "../../infraestructure/repositories/token.repository";
import { TokenDatasourceImpl } from "../../infraestructure/datasources/token.datasource";

export class AuthMiddleware {
  static repositoryUser = new AuthRepositoryImpl(new AuthDatasourceImpl());
  static repositoryToken = new TokenRepositoryImpl(new TokenDatasourceImpl());

  private static async registerTokenBlacklist(token: string, expireIn: number) {
    await this.repositoryToken.create(token, expireIn);
  }

  private static async verifyAccessToken(token: string) {
    const decoded = await JWTAdapter.verifyToken<{
      email: string;
      username: string;
    }>(token, JWTAdapter.ACCESS_TOKEN);
    if (!decoded) return false;
    const user = await AuthMiddleware.repositoryUser.findUserByEmail(
      decoded.email
    );
    if (!user) throw "Invalid access token - Access denied.";

    return decoded;
  }

  private static async verifyRefreshToken(token: string) {
    const decoded = await JWTAdapter.verifyToken<{
      email: string;
      username: string;
      exp: number;
    }>(token, JWTAdapter.REFRESH_TOKEN);
    if (!decoded) throw "Expired refresh token - Access denied.";
    2;

    const invalidToken = await this.repositoryToken.get(token);
    if (invalidToken) throw "Invalid refresh token - Access denied.";

    const user = await AuthMiddleware.repositoryUser.findUserByEmail(
      decoded.email
    );

    if (!user) {
      AuthMiddleware.registerTokenBlacklist(token, decoded.exp);
      throw "Invalid payload refresh token - Access denied.";
    }

    return decoded;
  }

  private static async validateAndGenerateAccessToken(
    accessToken: string,
    refreshToken: string
  ) {
    let user = await AuthMiddleware.verifyAccessToken(accessToken);
    if (user && Object.keys(user).length > 0) {
      return { user, newAccessToken: null };
    }
    const { email, username } = await AuthMiddleware.verifyRefreshToken(
      refreshToken
    );

    const newAccessToken = await JWTAdapter.signToken({
      payload: { email, username },
      SEED: JWTAdapter.ACCESS_TOKEN,
    });
    return { user: { email, username }, newAccessToken };
  }

  private static async processTokenVerification(
    req: Request,
    accessToken: string,
    refreshToken: string
  ) {
    if (!accessToken && !refreshToken)
      throw "Tokens not provided - Access denied.";
    try {
      const { user, newAccessToken } =
        await AuthMiddleware.validateAndGenerateAccessToken(
          accessToken,
          refreshToken
        );
      req.body.session = { user };
      if (newAccessToken) return newAccessToken;
    } catch (error) {
      throw error;
    }
  }

  static async hasToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (accessToken || refreshToken) {
      try {
        const newAccessToken = await AuthMiddleware.processTokenVerification(
          req,
          accessToken,
          refreshToken
        );
        if (newAccessToken)
          res.cookie("access_token", newAccessToken, {
            ...configCookies,
            maxAge: envs.ACCESS_COOKIE_EXPIRATION,
          });
      } catch (error) {
        res.clearCookie("access_token").clearCookie("refresh_token");
      }
    }
    next();
  }

  static async validateToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    try {
      const newAccessToken = await AuthMiddleware.processTokenVerification(
        req,
        accessToken,
        refreshToken
      );
      if (newAccessToken)
        res.cookie("access_token", newAccessToken, {
          ...configCookies,
          maxAge: envs.ACCESS_COOKIE_EXPIRATION,
        });
      return next();
    } catch (error) {
      res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .status(403)
        .json({ error });
    }
  }

  static async revokeToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      const { exp } = await AuthMiddleware.verifyRefreshToken(refreshToken);
      await AuthMiddleware.registerTokenBlacklist(refreshToken, exp);
    }
    next();
  }
}
