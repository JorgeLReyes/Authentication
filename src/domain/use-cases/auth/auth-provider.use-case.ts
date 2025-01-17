import { User } from "@prisma/client";
import { envs } from "../../../config/envs";
import { JWTAdapter } from "../../../config/jwt";
import { CustomError } from "../../../config/error";
import { GoogleUserDto } from "../../dtos/auth/google-user.dto";
import { AuthRepository } from "../../repositories/user.repository";
import { fromUser } from "../../../infraestructure/mappers/user.mapper";
import { UserDto } from "../../../types";

export class AuthWithProvider {
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

  handleValidateInformation = (
    strategyAuth: string,
    informationUser: any
  ): Promise<{
    domain: string;
    error?: any;
    tokens?: { accessToken: string; refreshToken: string };
    redirect?: string;
    authFail?: boolean;
  }> => {
    return this.handleUserProfile<User>(strategyAuth, informationUser)
      .then(async (user) => {
        const { email, username } = user!;

        const tokens = {
          accessToken: await JWTAdapter.signToken({
            payload: { email, username },
            expiresIn: envs.ACCESS_TOKEN_EXPIRATION,
            SEED: JWTAdapter.ACCESS_TOKEN,
          }),
          refreshToken: await JWTAdapter.signToken({
            payload: { email, username },
            expiresIn: envs.REFRESH_TOKEN_EXPIRATION,
            SEED: JWTAdapter.REFRESH_TOKEN,
          }),
        };

        return {
          tokens,
          redirect: "/",
          domain: envs.DOMAIN,
        };
      })
      .catch((error) => {
        return {
          redirect: "/",
          domain: envs.DOMAIN,
          authFail: true,
          error,
        };
      });
  };
}
