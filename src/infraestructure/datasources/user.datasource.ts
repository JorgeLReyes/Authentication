import { prisma } from "../../config/prismaClient";
import { CustomError } from "../../config/error";
import { BcryptAdapter } from "../../config/bcrypt";
import { AuthDatasource } from "../../domain/datasources/datasource";
import type { RegisterUserDto } from "../../domain/dtos/auth/register.dto";
import type { LoginUserDto } from "../../domain/dtos/auth/login.dto";

export class AuthDatasourceImpl implements AuthDatasource {
  async findUser(username: string) {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    return userExists;
  }

  async create(registerUserDto: RegisterUserDto) {
    const userExists = await this.findUser(registerUserDto.username);
    if (userExists) {
      throw CustomError.badRequest("Don't want to create");
    }

    const { username, password } = registerUserDto;
    const user = await prisma.user.create({
      data: { username, password: await BcryptAdapter.hash(password) },
    });

    return user;
  }
  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.findUser(username);

    if (!user) {
      throw CustomError.badRequest("User already exists");
    }

    if (!(await BcryptAdapter.compare({ password, hash: user.password }))) {
      throw CustomError.badRequest(
        "Invalid login: username or password incorrect"
      );
    }
    return user;
  }
}
