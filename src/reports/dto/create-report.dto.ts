import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID, MaxDate } from 'class-validator';

export class CreateReportDto {
  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  data: Date;

  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  data_final: Date;

  @IsUUID()
  iduser: string;

  @IsString()
  @IsOptional()
  nome: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsString()
  @IsOptional()
  arquivo_path: string;
}
