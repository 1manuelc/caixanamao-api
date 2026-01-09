import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsUUID } from 'class-validator';

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
  @Type(() => Date)
  data!: Date;

  @IsDate()
  @Type(() => Date)
  data_final!: Date;
}
