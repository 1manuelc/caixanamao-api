import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset } = paginationDto;
    return await this.prismaService.tbusuario.findMany({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.tbusuario.findFirst({
      where: { iduser: id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.prismaService.tbusuario.findUnique({
      where: { iduser: id },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.senha !== updateUserDto.senha_confirmacao) {
      throw new BadRequestException(
        'A senha e a confirmação precisam ser iguais!',
      );
    }

    const { cargo, ...rest } = updateUserDto;
    return this.prismaService.tbusuario.update({
      where: { iduser: id },
      data: {
        ...rest,
        atualizado_em: new Date(),
        tbcargo: {
          connect: {
            id: cargo !== userExists.id_cargo ? cargo : userExists.id_cargo,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const user = await this.prismaService.tbusuario.findFirst({
      where: { iduser: id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prismaService.tbusuario.delete({ where: { iduser: id } });
    return user;
  }
}
