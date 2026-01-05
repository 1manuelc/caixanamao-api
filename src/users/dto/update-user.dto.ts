import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  MaxDate,
  IsNumber,
  Min,
  Max,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nome: string;

  @IsDate()
  @MaxDate(new Date()) // nao pode ser no futuro
  @Type(() => Date)
  @IsOptional()
  nasc: Date;

  @IsNumber()
  @Min(1)
  @Max(4)
  @IsOptional()
  cargo: number;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsString()
  @MinLength(8)
  senha_confirmacao: string;
}
