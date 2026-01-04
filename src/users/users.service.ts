import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { nome, cpf, nasc, cargo, email, senha, senha_confirmacao } =
      createUserDto;

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
          senha,
        },
      });

      return user;
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async findAll() {
    return await this.prismaService.tbusuario.findMany();
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
