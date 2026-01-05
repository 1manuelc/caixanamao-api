import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PasswordService } from 'src/common/password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    const user = await this.prismaService.tbusuario.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário inexistente');
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      senha,
      user.senha,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = jwt.sign({ id: user.iduser }, process.env.SECRET_KEY!, {
      expiresIn: 2400, //40min
    });

    return token;
  }

  async register(registerDto: RegisterDto) {
    const { nome, cpf, nasc, cargo, email, senha, senha_confirmacao } =
      registerDto;

    if (senha !== senha_confirmacao) {
      throw new BadGatewayException(
        'A senha e a confirmação precisam ser iguais!',
      );
    }

    try {
      return await this.prismaService.tbusuario.create({
        data: {
          iduser: uuidv4(),
          nome,
          cpf,
          nasc,
          id_cargo: cargo,
          email,
          senha: await this.passwordService.hashPassword(senha),
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
