export class RegisterUserDto {
  private constructor(public username: string, public password: string) {}
  static create(user: { [key: string]: string }): [string?, RegisterUserDto?] {
    const { username, password } = user;

    if (username === undefined || username === "")
      return ["Username is not specified"];
    if (password.length < 8)
      return ["Password is must be at least 8 characters"];
    try {
      return [undefined, new RegisterUserDto(username, password)];
    } catch (error) {
      throw error;
    }
  }
}
