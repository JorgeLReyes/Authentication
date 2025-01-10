import { AuthRepository } from "../../repositories/user.repository";
import { CustomError } from "../../../config/error";
import { fromUser } from "../../../infraestructure/mappers/user.mapper";
import { RequestBody } from "../../../types";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { JWTAdapter } from "../../../config/jwt";

export class LoginUser {
  constructor(private repository: AuthRepository, private data: RequestBody) {}
  async execute() {
    const [error, dataDto] = LoginUserDto.create(this.data);
    if (error) throw CustomError.badRequest(error);

    const user = await this.repository.login(dataDto!);
    const { username, id } = fromUser(user);
    return {
      user: { username },
      token:
        "Bearer " +
        (await JWTAdapter.signToken({
          payload: {
            id,
            username,
          },
        })),
    };
  }
}
