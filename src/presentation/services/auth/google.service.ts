import passport from "passport";
import { CustomError } from "../../../config/error";
import { GoogleUserDto } from "../../../domain/dtos/auth/google-user.dto";
import { AuthRepository } from "../../../domain/repositories/user.repository";
import { fromUser } from "../../../infraestructure/mappers/user.mapper";
import { UserDto } from "../../../types";
import { NextFunction, Request, Response } from "express";
import { envs } from "../../../config/envs";
import { User } from "@prisma/client";
import { JWTAdapter } from "../../../config/jwt";
import { configCookies } from "../../../config/cookies";

export class GoogleAuthService {
  constructor(private repository: AuthRepository) {}

  private async login(data: { [key: string]: any }) {
    const user = await this.repository.login(data as UserDto);
    return fromUser(user);
  }

  private async register(data: { [key: string]: any }) {
    const user = await this.repository.create(data as UserDto);
    return fromUser(user);
  }

  private async handleUserProfile<T>(
    option: string,
    googleUserDto: GoogleUserDto
  ) {
    if (option === "login") {
      return await (<T>this.login(googleUserDto));
    }
    if (option === "register") {
      return await (<T>this.register(googleUserDto));
    }

    throw CustomError.internalServer("Option not supported");
  }

  private handleInformationGoogle = (
    req: Request,
    res: Response,
    error: Error,
    informationUser: any
  ) => {
    if (error) {
      res.render("redirect", {
        redirect: "/",
        domain: envs.DOMAIN,
        authFail: true,
        error,
      });
      return;
    }

    const option = req.cookies["x-strategy"];
    this.handleUserProfile<User>(option, informationUser)
      .then(async (user) => {
        const { username, id } = user!;

        const token =
          "Bearer " +
          (await JWTAdapter.signToken({
            payload: {
              id,
              username,
            },
          }));
        res
          .cookie("access_token", token, configCookies)
          .render("redirect", { redirect: "/", domain: envs.DOMAIN });
      })
      .catch((error) => {
        res.render("redirect", {
          redirect: "/",
          domain: envs.DOMAIN,
          authFail: true,
          error,
        });
      });
  };

  authenticateWithGoogle(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(
      "google",
      { session: false },
      (error, informationUser) =>
        this.handleInformationGoogle(req, res, error, informationUser)
    )(req, res, next);
  }
}
