import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsUUID, MaxDate } from 'class-validator';

export class CreateRegisterDto {
  @IsUUID()
  iduser!: string;

  @IsNumber()
  @Type(() => Number)
  valor_inicial!: number;

  @IsNumber()
  @Type(() => Number)
  valor_especie!: number;

  @IsNumber()
  @Type(() => Number)
  valor_cartao!: number;

  @IsNumber()
  @Type(() => Number)
  valor_pix!: number;

  @IsNumber()
  @Type(() => Number)
  valor_despesas!: number;

  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  data!: Date;

  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  data_final!: Date;
}
