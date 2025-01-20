export interface UserEntity {
  id: number;
  username: string;
  email: string;
  password?: string;
  provider?: string;
  providerId?: string;
  token?: string;
}

export type comparePasssword = {
  password: string;
  hash: string;
};

export type RequestBody = { [key: string]: any };

export interface UserDto {
  email: string;
  username: string;
  password?: string;
  provider?: string;
  providerId?: string;
  token?: string;
}

export interface GoogleUser {
  id: string;
  displayName: string;
  name: GoogleName;
  emails: GoogleEmail[];
  photos: GooglePhoto[];
  provider: string;
  _raw: string;
  _json: GoogleJson;
}

interface GoogleJson {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

interface GoogleEmail {
  value: string;
  verified: boolean;
}

interface GoogleName {
  familyName: string;
  givenName: string;
}

interface GooglePhoto {
  value: string;
}
