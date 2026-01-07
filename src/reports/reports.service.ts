import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryReportDto } from './dtos/query-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prismaService: PrismaService) {}

  private async getReportValues(data: Date, data_final: Date) {
    const values = await this.prismaService.tbentradadevalores.aggregate({
      _min: {
        data: true,
      },
      _max: {
        data: true,
      },
      _sum: {
        valor_cartao: true,
        valor_especie: true,
        valor_pix: true,
        valor_despesas: true,
      },
      where: {
        data: {
          gte: new Date(data),
          lte: new Date(data_final),
        },
      },
    });

    return {
      valor_cartao: Number(values._sum.valor_cartao),
      valor_especie: Number(values._sum.valor_especie),
      valor_pix: Number(values._sum.valor_pix),
      valor_despesas: Number(values._sum.valor_despesas),
    };
  }

  async create(createReportDto: CreateReportDto) {
    const { data, data_final, iduser, nome, descricao, arquivo_path } =
      createReportDto;

    const user = await this.prismaService.tbusuario.findFirst({
      where: { iduser },
    });

    if (!user) {
      throw new BadRequestException('Usuário inexistente');
    }

    const reportValues = await this.getReportValues(data, data_final);
    const reportInfo = await this.prismaService.tbrelatorio.create({
      data: {
        id_usuario: iduser,
        data,
        data_final,
        nome,
        descricao,
        arquivo_path,
        criado_em: new Date(),
        atualizado_em: new Date(),
      },
    });

    const finalReport = {
      ...reportInfo,
      values: {
        ...reportValues,
      },
    };

    return finalReport;
  }

  async findAll(queryReportDto: QueryReportDto) {
    const { includeValues, limit = 10, offset } = queryReportDto;
    const reports = await this.prismaService.tbrelatorio.findMany({
      take: limit,
      skip: offset,
    });

    if (includeValues) {
      return Promise.all(
        reports.map(async (report) => {
          const values = await this.getReportValues(
            new Date(report.data),
            new Date(report.data_final),
          );

          return {
            ...report,
            values,
          };
        }),
      );
    }

    return reports;
  }

  async findOne(id: number) {
    const report = await this.prismaService.tbrelatorio.findFirst({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Relatório não encontrado');
    }

    const reportValues = await this.getReportValues(
      new Date(report.data),
      new Date(report.data_final),
    );

    return { ...report, values: { ...reportValues } };
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const { nome, descricao, data, data_final } = updateReportDto;

    const reportExists = await this.prismaService.tbrelatorio.findUnique({
      where: { id },
    });

    if (!reportExists) {
      throw new NotFoundException('Relatório não encontrado');
    }

    return this.prismaService.tbrelatorio.update({
      where: { id },
      data: {
        nome,
        descricao,
        data,
        data_final,
        atualizado_em: new Date(),
      },
    });
  }

  async remove(id: number) {
    const reportExists = await this.prismaService.tbrelatorio.findUnique({
      where: { id },
    });

    if (!reportExists) {
      throw new NotFoundException('Relatório não encontrado');
    }

    await this.prismaService.tbrelatorio.delete({
      where: { id },
    });

    return reportExists;
  }
}
