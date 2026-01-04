import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxDate,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  nome: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}/)
  cpf: string;

  @IsDate()
  @MaxDate(new Date()) // nao pode ser no futuro
  @Type(() => Date)
  nasc: Date;

  @IsNumber()
  @Min(1)
  @Max(4)
  cargo: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsString()
  @MinLength(8)
  senha_confirmacao: string;
}
