import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PasswordService } from 'src/common/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset } = paginationDto;
    return await this.prismaService.tbusuario.findMany({
      take: limit,
      skip: offset,
      omit: { senha: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.tbusuario.findFirst({
      where: { iduser: id },
      omit: { senha: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userExists = await this.prismaService.tbusuario.findUnique({
        where: { iduser: id },
      });

      if (!userExists) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const isPasswordValid = await this.passwordService.verifyPassword(
        userExists.senha,
        updateUserDto.senha,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const { cargo, senha, id_empresa, ...rest } = updateUserDto;
      return this.prismaService.tbusuario.update({
        where: { iduser: id },
        data: {
          ...rest,
          atualizado_em: new Date(),
          senha: await this.passwordService.hashPassword(senha),
          tbcargo: cargo
            ? {
                connect: {
                  id:
                    cargo !== userExists.id_cargo ? cargo : userExists.id_cargo,
                },
              }
            : undefined,
          tbempresa: id_empresa
            ? {
                connect: {
                  id:
                    id_empresa !== userExists.id_empresa
                      ? id_empresa
                      : userExists.id_empresa,
                },
              }
            : undefined,
        },
        omit: { senha: true },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prismaService.tbusuario.findFirst({
        where: { iduser: id },
        omit: { senha: true },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.prismaService.tbusuario.delete({ where: { iduser: id } });
      return user;
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
