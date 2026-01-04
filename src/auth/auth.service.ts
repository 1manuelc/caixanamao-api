import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';

import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    if (!email) {
      throw new BadRequestException('O email é obrigatório!');
    }

    if (!senha) {
      throw new BadRequestException('A senha é obrigatória!');
    }

    const user = await this.prismaService.tbusuario.findUnique({
      where: { email },
    });

    if (user === null) {
      throw new NotFoundException('Email e/ou senha incorretos!');
    }

    const checkPassword = senha == user.senha;

    if (!checkPassword) {
      throw new BadRequestException('Email e/ou senha incorretos!');
    }

    const expiresIn = 2400; //40min
    const token = jwt.sign({ id: user.iduser }, process.env.SECRET_KEY!, {
      expiresIn: expiresIn,
    });

    return token;
  }
}
