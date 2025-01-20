export abstract class TokenRepository {
  abstract get(token: string): any;
  abstract create(token: string, expireIn: number): any;
  abstract delete(date: number): any;
}
