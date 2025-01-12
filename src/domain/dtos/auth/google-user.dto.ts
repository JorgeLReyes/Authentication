import { GoogleUser, UserDto } from "../../../types";

export class GoogleUserDto implements UserDto {
  private constructor(
    public username: string,
    public email: string, // public photos: { value: string }[]
    public provider: string
  ) {}
  static create(user: GoogleUser): [string?, GoogleUserDto?] {
    const {
      displayName,
      _json: { email },
      // photos,
    } = user;
    // console.log(user);
    if (email === undefined) return ["User reject permission"];

    try {
      return [undefined, new GoogleUserDto(displayName, email, "google")];
    } catch (error) {
      return ["Error format invalid Google User"];
    }
  }
}
