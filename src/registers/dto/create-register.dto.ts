import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsUUID, MaxDate } from 'class-validator';

export class CreateRegisterDto {
  @IsUUID()
  iduser: string;

  @IsNumber()
  valor_inicial: number;

  @IsNumber()
  valor_especie: number;

  @IsNumber()
  valor_cartao: number;

  @IsNumber()
  valor_pix: number;

  @IsNumber()
  valor_despesas: number;

  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  data: Date;

  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  data_final: Date;
}
