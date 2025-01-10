import { prisma } from "../../config/prismaClient";
import { CustomError } from "../../config/error";
import { BcryptAdapter } from "../../config/bcrypt";
import { AuthDatasource } from "../../domain/datasources/datasource";
import type { UserDto } from "../../types";

export class AuthDatasourceImpl implements AuthDatasource {
  async findUser(email: string) {
    console.log(email);
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    return userExists;
  }

  async create(registerUserDto: UserDto) {
    try {
      const userExists = await this.findUser(registerUserDto.email!);
      if (userExists) {
        console.log("User exists");
        throw CustomError.badRequest("Don't want to create");
      }
      console.log(userExists);
      const { password, ...userInfo } = registerUserDto;
      const user = await prisma.user.create({
        data: {
          ...userInfo,
          password: password && (await BcryptAdapter.hash(password)),
        },
      });

      return user;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }
  async login(loginUserDto: UserDto) {
    const { email, password = "" } = loginUserDto;
    const user = await this.findUser(email);

    if (!user) {
      throw CustomError.badRequest("User already exists");
    }
    console.log(user);
    if (
      !user.provider &&
      !(await BcryptAdapter.compare({ password, hash: user.password! }))
    ) {
      throw CustomError.badRequest(
        "Invalid login: username or password incorrect"
      );
    }

    return user;
  }
}
