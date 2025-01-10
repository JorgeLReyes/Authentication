import { regularExps } from "../../../config/regular-exp";
import { UserDto } from "../../../types";

export class RegisterUserDto implements UserDto {
  private constructor(
    public username: string,
    public email: string,
    public password: string
  ) {}
  static create(user: { [key: string]: string }): [string?, RegisterUserDto?] {
    const { username, email, password } = user;

    try {
      if (username === undefined || username === "")
        return ["Username is not specified"];
      if (!regularExps.email.exec(email)) return ["Invalid email"];
      if (password.length < 8)
        return ["Password is must be at least 8 characters"];
      return [undefined, new RegisterUserDto(username, email, password)];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
