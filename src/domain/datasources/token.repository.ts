export abstract class TokenDatasource {
  abstract get(token: string): any;
  abstract create(token: string, expireIn: number): any;
  abstract delete(date: number): any;
}
