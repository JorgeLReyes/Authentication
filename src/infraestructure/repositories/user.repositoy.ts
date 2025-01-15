import { AuthDatasource } from "../../domain/datasources/datasource";
import { AuthRepository } from "../../domain/repositories/user.repository";
import { UserDto } from "../../types";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authDatasource: AuthDatasource) {}
  async findUserByEmail(email: string) {
    return this.authDatasource.findUserByEmail(email);
  }

  async create(registerUserDto: UserDto) {
    return this.authDatasource.create(registerUserDto);
  }
  async login(loginUserDto: UserDto) {
    return this.authDatasource.login(loginUserDto);
  }
}
