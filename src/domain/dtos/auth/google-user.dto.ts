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

    try {
      return [undefined, new GoogleUserDto(displayName, email, "google")];
    } catch (error) {
      throw ["Error format invalid Google User"];
    }
  }
}
