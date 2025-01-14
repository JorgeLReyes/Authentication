import { NextFunction, Request, Response } from "express";
import { CreateUser } from "../../../domain/use-cases/auth/register";
import { AuthRepository } from "../../../domain/repositories/user.repository";
import { CustomError } from "../../../config/error";
import { LoginUser } from "../../../domain/use-cases/auth/login";
import { configCookies } from "../../../config/cookies";
import { RedirectToGoogleAuth } from "../../../domain/use-cases/auth/redirect-google-auth";
import { HandleGoogleAuthCallback } from "../../../domain/use-cases/auth/callback-google-auth";
import { GoogleAuthService } from "../../services/auth/google.service";

export class AuthController {
  constructor(
    private repository: AuthRepository,
    private service: GoogleAuthService
  ) {}

  private handleError = (res: Response, error: unknown) => {
    console.log(error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }
    res.status(500).json({ error: `Internal server error: ${error}` });
  };
  registerWithCredentials = (req: Request, res: Response) => {
    console.log(req.body);
    new CreateUser(this.repository, req.body)
      .execute()
      .then((user) => res.json(user))
      .catch((error) => this.handleError(res, error));
  };

  loginWithCredentials = (req: Request, res: Response) => {
    new LoginUser(this.repository, req.body)
      .execute()
      .then((user) => {
        const { token } = user;
        res.cookie("access_token", token, configCookies).json(user);
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
    new RedirectToGoogleAuth().execute(req, res, next);
  };

  processGoogleAuthCallback = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new HandleGoogleAuthCallback()
      .execute(this.service)(req, res, next)
      .catch((error) => this.handleError(res, error));
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie("access_token").json({ msg: "logged out" });
  };
}
