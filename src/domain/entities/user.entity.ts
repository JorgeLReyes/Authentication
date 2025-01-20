import { UserEntity } from "../../types";

export class User {
  public id: number;
  public username: string;
  public email: string;
  public password?: string;
  public provider?: string;
  public providerId?: string;
  public token?: string;

  constructor({
    id,
    username,
    email,
    password,
    provider,
    providerId,
    token,
  }: UserEntity) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.provider = provider;
    this.providerId = providerId;
    this.token = token;
  }
}
