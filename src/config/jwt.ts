import jwt from "jsonwebtoken";
import { envs } from "./envs";

interface JWT {
  payload: { [key: string]: any };
  expiresIn?: string | number;
  SEED: string;
}

export class JWTAdapter {
  static ACCESS_TOKEN = envs.SEED_ACCESS_TOKEN;
  static REFRESH_TOKEN = envs.SEED_REFRESH_TOKEN;

  static signToken = ({
    payload,
    expiresIn = "1m",
    SEED,
  }: JWT): Promise<any> => {
    return new Promise((resolve) =>
      jwt.sign(payload, SEED, { expiresIn }, (err, token) => {
        if (err) return resolve(null);
        return resolve(token);
      })
    );
  };

  static verifyToken = <T>(token: string, SEED: string): Promise<T | null> => {
    return new Promise((resolve) => {
      jwt.verify(token, SEED, (err, payload) => {
        if (err) {
          return resolve(null);
        }
        return resolve(<T>payload);
      });
    });
  };
}
