import { CustomError } from "../../../config/error";
import { GoogleUserDto } from "../../../domain/dtos/auth/google-user.dto";
import { AuthRepository } from "../../../domain/repositories/user.repository";
import { fromUser } from "../../../infraestructure/mappers/user.mapper";
import { UserDto } from "../../../types";

export class GoogleAuthService {
  constructor(private repository: AuthRepository) {}

  async login(data: { [key: string]: any }) {
    const user = await this.repository.login(data as UserDto);
    return fromUser(user);
  }

  async register(data: { [key: string]: any }) {
    const user = await this.repository.create(data as UserDto);
    return fromUser(user);
  }

  async handleUserProfile<T>(option: string, googleUserDto: GoogleUserDto) {
    if (option === "login") {
      return await (<T>this.login(googleUserDto));
    }
    if (option === "register") {
      return await (<T>this.register(googleUserDto));
    }

    throw CustomError.internalServer("Option not supported");
  }
}
