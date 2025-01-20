import { NextFunction, Request, Response } from "express";
import { CreateUser } from "../../../domain/use-cases/auth/register.use-case";
import { AuthRepository } from "../../../domain/repositories/user.repository";
import { CustomError } from "../../../config/error";
import { LoginUser } from "../../../domain/use-cases/auth/login.use-case";
import { configCookies } from "../../../config/cookies";
import { PassportAuthService } from "../../services/auth/passport.service";
import { envs } from "../../../config/envs";
import { AuthWithProvider } from "../../../domain/use-cases/auth/auth-provider.use-case";

export class AuthController {
  constructor(
    private repository: AuthRepository,
    private service: typeof PassportAuthService
  ) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }
    res.status(500).json({ error: `Internal server error: ${error}` });
  };

  registerWithCredentials = (req: Request, res: Response) => {
    new CreateUser(this.repository, req.body)
      .execute()
      .then((user) => res.json(user))
      .catch((error) => this.handleError(res, error));
  };

  loginWithCredentials = (req: Request, res: Response) => {
    new LoginUser(this.repository, req.body)
      .execute()
      .then((user) => {
        const {
          tokens: { accessToken, refreshToken },
        } = user;
        res
          .cookie("access_token", accessToken, {
            ...configCookies,
            maxAge: envs.ACCESS_COOKIE_EXPIRATION,
          })
          .cookie("refresh_token", refreshToken, {
            ...configCookies,
            maxAge: envs.REFRESH_COOKIE_EXPIRATION,
          })
          .json(user);
      })
      .catch((error) => this.handleError(res, error));
  };

  loginWithGoogle = (req: Request, res: Response, next: NextFunction) => {
    res.cookie("x-strategy", "login");
    this.initiateGoogleRedirect(req, res, next);
  };

  registerWithGoogle = (req: Request, res: Response, next: NextFunction) => {
    res.cookie("x-strategy", "register");
    this.initiateGoogleRedirect(req, res, next);
  };

  initiateGoogleRedirect = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.service.redirectToGoogle()(req, res, next);
  };

  processGoogleAuthCallback = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.service.authenticateWithGoogle(req, res, next);
  };

  sucessWithGoogle = (req: Request, res: Response) => {
    const strategy = req.cookies["x-strategy"];
    new AuthWithProvider(this.repository)
      .handleValidateInformation(strategy, req.user)
      .then((data) => {
        const { error, tokens, ...rest } = data;
        if (error) return res.render("redirect", data);
        const { accessToken, refreshToken } = tokens!;

        if (strategy === "login") {
          res
            .cookie("access_token", accessToken, {
              ...configCookies,
              maxAge: envs.ACCESS_COOKIE_EXPIRATION,
            })
            .cookie("refresh_token", refreshToken, {
              ...configCookies,
              maxAge: envs.REFRESH_COOKIE_EXPIRATION,
            });
        }
        res.clearCookie("x-strategy");
        res.render("redirect", rest);
      });
  };

  failWithGoogle = (req: Request, res: Response) => {
    res.render("redirect", {
      redirect: "/",
      domain: envs.DOMAIN,
      authFail: true,
      error: "Authentication failed",
    });
  };

  logout = (req: Request, res: Response) => {
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ msg: "logged out" });
  };
}
