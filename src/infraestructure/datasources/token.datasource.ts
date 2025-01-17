import { prisma } from "../../config/prismaClient";
import { TokenDatasource } from "../../domain/datasources/token.repository";

export class TokenDatasourceImpl implements TokenDatasource {
  async get(token: string) {
    return await prisma.tokens.findUnique({
      where: { token },
    });
  }

  async create(token: string, expireIn: number) {
    try {
      if (!(await this.get(token))) {
        await prisma.tokens.create({
          // expireIn in ms, jtw format is in seconds
          data: { token, expireIn: expireIn * 1000 },
        });
      }
    } catch (error) {}
  }
  async delete(date: number) {
    try {
      await prisma.tokens.deleteMany({
        where: {
          expireIn: {
            lte: date,
          },
        },
      });
    } catch (error) {}
  }
}
