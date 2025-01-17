import { AuthRepository } from "../../repositories/user.repository";
import { CustomError } from "../../../config/error";
import { fromUser } from "../../../infraestructure/mappers/user.mapper";
import { RequestBody } from "../../../types";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { JWTAdapter } from "../../../config/jwt";
import { envs } from "../../../config/envs";

export class LoginUser {
  constructor(private repository: AuthRepository, private data: RequestBody) {}
  async execute() {
    const [error, dataDto] = LoginUserDto.create(this.data);
    if (error) throw CustomError.badRequest(error);

    const user = await this.repository.login(dataDto!);
    const { email, username } = fromUser(user);
    return {
      user: { email },
      tokens: {
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
      },
    };
  }
}
