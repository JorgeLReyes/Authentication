import { NextFunction, Request, Response } from "express";
import { CreateUser } from "../../../domain/use-cases/auth/register";
import { AuthRepository } from "../../../domain/repositories/user.repository";
import { CustomError } from "../../../config/error";
import { LoginUser } from "../../../domain/use-cases/auth/login";
import { configCookies } from "../../../config/cookies";
import { RedirectToGoogleAuth } from "../../../domain/use-cases/auth/redirect-google-auth";
import { CallbackGoogleAuth } from "../../../domain/use-cases/auth/callback-google-auth";
import { GoogleAuthService } from "../../services/auth/google.service";

export class AuthController {
  constructor(
    private repository: AuthRepository,
    private service: GoogleAuthService
  ) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }
    res.status(500).json({ error: `Internal server error: ${error}` });
  };
  registerUser = (req: Request, res: Response) => {
    new CreateUser(this.repository, req.body)
      .execute()
      .then((user) => res.json(user))
      .catch((error) => this.handleError(res, error));
  };

  loginUser = (req: Request, res: Response) => {
    new LoginUser(this.repository, req.body)
      .execute()
      .then((user) => {
        const { token } = user;
        res.cookie("access_token", token, configCookies).json(user);
      })
      .catch((error) => this.handleError(res, error));
  };

  loginGoogle = (req: Request, res: Response, next: NextFunction) => {
    res.cookie("x-strategy", "login");
    this.redirectToGoogle(req, res, next);
  };

  registerGoogle = (req: Request, res: Response, next: NextFunction) => {
    res.cookie("x-strategy", "register");
    this.redirectToGoogle(req, res, next);
  };

  redirectToGoogle = (req: Request, res: Response, next: NextFunction) => {
    new RedirectToGoogleAuth().execute(req, res, next);
  };

  callbackGoogle = (req: Request, res: Response, next: NextFunction) => {
    new CallbackGoogleAuth()
      .execute(this.service)(req, res, next)
      .catch((error) => this.handleError(res, error));
  };

  logoutUser = (req: Request, res: Response) => {
    res.clearCookie("access_token").json({ msg: "logged out" });
  };
}
