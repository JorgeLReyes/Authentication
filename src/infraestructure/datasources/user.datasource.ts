import { prisma } from "../../config/prismaClient";
import { CustomError } from "../../config/error";
import { BcryptAdapter } from "../../config/bcrypt";
import { AuthDatasource } from "../../domain/datasources/datasource";
import type { UserDto } from "../../types";

export class AuthDatasourceImpl implements AuthDatasource {
  async findUserByEmail(email: string) {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    return userExists;
  }

  async create(registerUserDto: UserDto) {
    try {
      const userExists = await this.findUserByEmail(registerUserDto.email!);
      if (userExists) {
        throw CustomError.conflic("This email is already registered");
      }
      const { password, ...userInfo } = registerUserDto;
      const user = await prisma.user.create({
        data: {
          ...userInfo,
          password: password && (await BcryptAdapter.hash(password)),
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
  async login(loginUserDto: UserDto) {
    const { email, password, provider } = loginUserDto;
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw CustomError.badRequest("User doesn't exist");
    }

    if (user.provider && password) {
      throw CustomError.conflic(
        "This email is associated with an external provider (OAuth). Please use 'Sign in with [options]"
      );
    }

    if (provider && user.password) {
      throw CustomError.conflic(
        "This email not is associated with an external provider."
      );
    }

    if (
      password &&
      !(await BcryptAdapter.compare({ password, hash: user.password! }))
    ) {
      throw CustomError.badRequest(
        "Invalid login: username or password incorrect"
      );
    }

    console.log(user);
    return user;
  }
}
