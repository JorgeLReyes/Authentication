import { AuthDatasource } from "../../domain/datasources/datasource";
import { AuthRepository } from "../../domain/repositories/user.repository";
import { UserDto } from "../../types";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authDatasource: AuthDatasource) {}

  async create(registerUserDto: UserDto) {
    return this.authDatasource.create(registerUserDto);
  }
  login(loginUserDto: UserDto) {
    return this.authDatasource.login(loginUserDto);
  }
}
