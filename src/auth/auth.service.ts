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
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'senha'>;
  }> {
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
        user: {
          iduser: user.iduser,
          nome: user.nome,
          cpf: user.cpf,
          email: user.email,
          nasc: user.nasc,
          ativo: user.ativo,
          id_cargo: user.id_cargo,
          id_empresa: user.id_empresa,
          criado_em: user.criado_em,
          atualizado_em: user.atualizado_em,
        },
        accessToken: this.jwtService.sign(
          { id: user.iduser, role: user.id_cargo },
          { expiresIn: '40m' }, //40min
        ),
        refreshToken: this.jwtService.sign(
          { id: user.iduser, role: user.id_cargo },
          { expiresIn: '7d' },
        ),
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
      throw new InternalServerErrorException('Erro desconhecido');
    }
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<
    | { accessToken: string; refreshToken: string; user: Omit<User, 'senha'> }
    | undefined
  > {
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
      const user = await this.prismaService.tbusuario.create({
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
        omit: { senha: true },
      });

      return {
        user: {
          iduser: user.iduser,
          nome: user.nome,
          cpf: user.cpf,
          email: user.email,
          nasc: user.nasc,
          ativo: user.ativo,
          id_cargo: user.id_cargo,
          id_empresa: user.id_empresa,
          criado_em: user.criado_em,
          atualizado_em: user.atualizado_em,
        },
        accessToken: this.jwtService.sign(
          { id: user.iduser, role: user.id_cargo },
          { expiresIn: '40m' }, //40min
        ),
        refreshToken: this.jwtService.sign(
          { id: user.iduser, role: user.id_cargo },
          { expiresIn: '7d' },
        ),
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async refreshTokens(refreshToken: string): Promise<{
    user: Omit<User, 'senha'>;
    refreshToken: string;
    accessToken: string;
  }> {
    const decodedTokenData = this.jwtService.verify<{
      id: string;
      role: number;
    }>(refreshToken);

    const user = await this.userService.findOne(decodedTokenData.id);
    if (!user) {
      throw new UnauthorizedException('Token expirado ou inválido');
    }

    return {
      user,
      accessToken: this.jwtService.sign(
        { id: user.iduser, role: user.id_cargo },
        { expiresIn: '40m' }, //40min
      ),
      refreshToken: this.jwtService.sign(
        { id: user.iduser, role: user.id_cargo },
        { expiresIn: '7d' },
      ),
    };
  }
}
