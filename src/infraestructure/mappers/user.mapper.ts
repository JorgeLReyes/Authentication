import { CustomError } from "../../config/error";
import { User } from "../../domain/entities/user.entity";
import { UserEntity } from "../../types";

export const fromUser = (data: { [key: string]: any }): UserEntity => {
  console.log(data);
  const { id, _id, username, password } = data;

  if (!_id && !id) throw CustomError.badRequest("Missing id");
  if (!password) throw CustomError.badRequest("Missing password");

  return new User({ id, username, password });
};
