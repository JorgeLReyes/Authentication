import { Request, Response } from "express";
import { CreateUser } from "../../../domain/use-cases/auth/register";
import { AuthRepository } from "../../../domain/repositories/user.repository";
import { CustomError } from "../../../config/error";
import { LoginUser } from "../../../domain/use-cases/auth/login";
import { configCookies } from "../../../config/cookies";

export class AuthController {
  constructor(private repository: AuthRepository) {}

  private handleError = (res: Response, error: unknown) => {
    // console.log(error);
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

  logoutUser = (req: Request, res: Response) => {
    res.clearCookie("access_token").json({ msg: "logged out" });
  };
}
