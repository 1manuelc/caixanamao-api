import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegisterDto } from './dtos/create-register.dto';
import { UpdateRegisterDto } from './dtos/update-register.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { parseMoney } from './utils/parse-money-to-decimal.util';
import { Register } from './entities/register.entity';

@Injectable()
export class RegistersService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createRegisterDto: CreateRegisterDto,
  ): Promise<Register | undefined> {
    const {
      iduser,
      data,
      data_final,
      valor_inicial,
      valor_especie,
      valor_cartao,
      valor_pix,
      valor_despesas,
    } = createRegisterDto;

    try {
      const user = await this.prismaService.tbusuario.findFirst({
        where: { iduser },
      });

      if (!user) {
        throw new BadRequestException('Usuário inexistente');
      }

      const register = await this.prismaService.tbentradadevalores.create({
        data: {
          id: uuidv4(),
          iduser,
          valor_inicial,
          valor_especie,
          valor_cartao,
          valor_pix,
          valor_despesas,
          data,
          data_final,
        },
      });

      return parseMoney(register) as Register;
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Register[] | []> {
    const { limit = 10, offset } = paginationDto;
    const registers = await this.prismaService.tbentradadevalores.findMany({
      take: limit,
      skip: offset,
    });

    return parseMoney(registers) as Register[] | [];
  }

  async findOne(id: string): Promise<Register> {
    const register = await this.prismaService.tbentradadevalores.findFirst({
      where: { id },
    });

    if (!register) {
      throw new NotFoundException('Registro não encontrado');
    }

    return parseMoney(register) as Register;
  }
  async update(
    id: string,
    updateRegisterDto: UpdateRegisterDto,
  ): Promise<Register> {
    const registerExists =
      await this.prismaService.tbentradadevalores.findUnique({
        where: { id },
      });

    if (!registerExists) {
      throw new NotFoundException('Registro não encontrado');
    }

    const register = await this.prismaService.tbentradadevalores.update({
      where: { id },
      data: {
        ...updateRegisterDto,
        atualizado_em: new Date(),
      },
    });

    return parseMoney(register) as Register;
  }

  async remove(id: string): Promise<Register> {
    const registerExists =
      await this.prismaService.tbentradadevalores.findFirst({
        where: { id },
      });

    if (!registerExists) {
      throw new NotFoundException('Registro não encontrado');
    }

    await this.prismaService.tbentradadevalores.delete({ where: { id } });
    return parseMoney(registerExists) as Register;
  }
}
