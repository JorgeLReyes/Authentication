import { CustomError } from "../../config/error";
import { regularExps } from "../../config/regular-exp";
import { User } from "../../domain/entities/user.entity";
import { UserEntity } from "../../types";

export const fromUser = (data: { [key: string]: any }): UserEntity => {
  console.log(data);
  const { id, _id, username, email, password, provider } = data;

  if (!_id && !id) throw CustomError.badRequest("Missing id");
  if (!regularExps.email.exec(email))
    throw CustomError.badRequest("Email invalid formar");
  if (!regularExps.email.exec(email))
    throw CustomError.badRequest("Email must be a valid email");
  return new User({ id, username, password, email, provider });
};
