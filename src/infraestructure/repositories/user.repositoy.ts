import { AuthDatasource } from "../../domain/datasources/datasource";
import { LoginUserDto } from "../../domain/dtos/auth/login.dto";
import type { RegisterUserDto } from "../../domain/dtos/auth/register.dto";
import { AuthRepository } from "../../domain/repositories/user.repository";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authDatasource: AuthDatasource) {}

  async create(registerUserDto: RegisterUserDto) {
    return this.authDatasource.create(registerUserDto);
  }
  login(loginUserDto: LoginUserDto) {
    return this.authDatasource.login(loginUserDto);
  }
}
