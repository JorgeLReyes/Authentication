import jwt from "jsonwebtoken";
import { envs } from "./envs";

interface JWT {
  payload: { [key: string]: any };
  expiresIn?: string;
}

const SEED = envs.SEED;

export class JWTAdapter {
  static signToken = ({ payload, expiresIn = "1h" }: JWT): Promise<any> => {
    return new Promise((resolve) =>
      jwt.sign(payload, SEED, { expiresIn }, (err, token) => {
        if (err) return Promise.resolve(null);
        return resolve(token);
      })
    );
  };

  static verifyToken = (token: string) => {
    return new Promise((resolve) => {
      jwt.verify(token, SEED, (err, payload) => {
        if (err) return Promise.resolve(null);
        return resolve(payload);
      });
    });
  };
}
