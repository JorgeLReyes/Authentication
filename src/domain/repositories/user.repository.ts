import { LoginUserDto } from "../dtos/auth/login.dto";
import { RegisterUserDto } from "../dtos/auth/register.dto";

export abstract class AuthRepository {
  abstract create(registerUserDto: RegisterUserDto): any;
  abstract login(loginUserDto: LoginUserDto): any;
}
