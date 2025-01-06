import { compare, genSalt, hash } from "bcrypt";
import { CustomError } from "./error";
import { comparePasssword } from "../types";

export class BcryptAdapter {
  static async hash(password: any) {
    try {
      const salt = await genSalt(10);
      return hash(password, salt);
    } catch (e) {
      throw CustomError.internalServer("Error hashing data");
    }
  }

  static async compare({ password, hash }: comparePasssword) {
    try {
      return await compare(password, hash);
    } catch (e) {
      throw CustomError.internalServer("Error comparing password");
    }
  }
}
