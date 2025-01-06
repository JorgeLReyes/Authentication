export class LoginUserDto {
  private constructor(public username: string, public password: string) {}
  static create(user: { [key: string]: string }): [string?, LoginUserDto?] {
    const { username, password } = user;

    if (username === undefined || username === "")
      return ["Username is not specified"];
    if (password.length < 0)
      return ["Password is must be at least 0 characters"];
    try {
      return [undefined, new LoginUserDto(username, password)];
    } catch (error) {
      throw error;
    }
  }
}
