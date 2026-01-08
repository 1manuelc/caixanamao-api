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

import { v4 as uuidv4 } from 'uuid';
import { PasswordService } from 'src/common/password/password.service';
import { JwtService } from 'src/common/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; userId: string }> {
    const { email, senha } = loginDto;

    try {
      const user = await this.prismaService.tbusuario.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('Usuário inexistente');
      }

      const isPasswordValid = await this.passwordService.verifyPassword(
        user.senha,
        senha,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      return {
        accessToken: this.jwtService.sign(
          { id: user.iduser, role: user.id_cargo },
          { expiresIn: 2400 }, //40min
        ),
        userId: user.iduser,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
      throw new InternalServerErrorException('Erro desconhecido');
    }
  }

  async register(registerDto: RegisterDto) {
    const {
      nome,
      cpf,
      nasc,
      cargo,
      email,
      senha,
      senha_confirmacao,
      id_empresa,
    } = registerDto;

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
          id_empresa,
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
