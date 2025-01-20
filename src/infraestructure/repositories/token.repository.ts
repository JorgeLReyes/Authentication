import { TokenDatasource } from "../../domain/datasources/token.repository";
import { TokenRepository } from "../../domain/repositories/token.repository";

export class TokenRepositoryImpl implements TokenRepository {
  constructor(private tokenDatasource: TokenDatasource) {}

  get(token: string) {
    return this.tokenDatasource.get(token);
  }
  create(token: string, expireIn: number) {
    return this.tokenDatasource.create(token, expireIn);
  }
  delete(date: number) {
    return this.tokenDatasource.delete(date);
  }
}
