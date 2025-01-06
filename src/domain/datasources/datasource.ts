import type { LoginUserDto } from "../dtos/auth/login.dto";
import type { RegisterUserDto } from "../dtos/auth/register.dto";

export abstract class AuthDatasource {
  abstract create(registerUserDto: RegisterUserDto): any;
  abstract login(loginUserDto: LoginUserDto): any;
}
