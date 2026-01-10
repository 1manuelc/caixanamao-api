import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(private prismaService: PrismaService) {}
  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company | undefined> {
    const { cnpj, nome, telefone, cep, endereco } = createCompanyDto;

    try {
      return await this.prismaService.tbempresa.create({
        data: {
          nome,
          cnpj,
          telefone,
          cep,
          endereco,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Company[]> {
    const { limit = 10, offset } = paginationDto;
    return await this.prismaService.tbempresa.findMany({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<Company | undefined> {
    const company = await this.prismaService.tbempresa.findFirst({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const companyExists = await this.prismaService.tbempresa.findUnique({
      where: { id },
    });

    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prismaService.tbempresa.update({
      where: { id },
      data: {
        ...updateCompanyDto,
        atualizado_em: new Date(),
      },
    });
  }

  async remove(id: number): Promise<Company> {
    const companyExists = await this.prismaService.tbempresa.findUnique({
      where: { id },
    });

    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }

    await this.prismaService.tbempresa.delete({ where: { id } });
    return companyExists;
  }
}
