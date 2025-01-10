import { UserDto } from "../../types";

export abstract class AuthDatasource {
  abstract create(registerUserDto: UserDto): any;
  abstract login(loginUserDto: UserDto): any;
}
