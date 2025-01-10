import { regularExps } from "../../../config/regular-exp";
import { UserDto } from "../../../types";

export class LoginUserDto implements UserDto {
  private constructor(
    public username: string,
    public email: string,
    public password: string
  ) {}
  static create(user: { [key: string]: string }): [string?, LoginUserDto?] {
    const { username, password, email } = user;

    if (!regularExps.email.exec(email)) return ["Invalid email"];
    if (username === undefined || username === "")
      return ["Username is not specified"];
    if (password.length < 8)
      return ["Password is must be at least 8 characters"];
    try {
      return [undefined, new LoginUserDto(username, email, password)];
    } catch (error) {
      throw error;
    }
  }
}
