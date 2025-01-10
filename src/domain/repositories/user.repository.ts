import { UserDto } from "../../types";

export abstract class AuthRepository {
  abstract create(registerUserDto: UserDto): any;
  abstract login(loginUserDto: UserDto): any;
}
