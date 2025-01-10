import { AuthRepository } from "../../repositories/user.repository";
import { CustomError } from "../../../config/error";
import { fromUser } from "../../../infraestructure/mappers/user.mapper";
import { RequestBody } from "../../../types";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";

export class GoogleRegisterUser {
  constructor(private repository: AuthRepository, private data: RequestBody) {}
  async execute() {
    const [error, dataDto] = RegisterUserDto.create(this.data);
    if (error) throw CustomError.badRequest(error);

    const user = await this.repository.create(dataDto!);
    return fromUser(user);
  }
}
