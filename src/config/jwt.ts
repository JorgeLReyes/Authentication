import jwt from "jsonwebtoken";
import { envs } from "./envs";

interface JWT {
  payload: { [key: string]: any };
  expiresIn?: string | number;
}

const SEED = envs.SEED;

export class JWTAdapter {
  static signToken = ({ payload, expiresIn = "15m" }: JWT): Promise<any> => {
    return new Promise((resolve) =>
      jwt.sign(payload, SEED, { expiresIn }, (err, token) => {
        if (err) return resolve(null);
        return resolve(token);
      })
    );
  };

  static verifyToken = (token: string) => {
    return new Promise((resolve) => {
      jwt.verify(token, SEED, (err, payload) => {
        if (err) {
          console.log(err);
          return resolve(null);
        }
        return resolve(payload);
      });
    });
  };
}
